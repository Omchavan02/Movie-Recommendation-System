require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Movie = require('./models/Movie');

// Configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinemas';
const tmdbToken = (process.env.TMDB_ACCESS_TOKEN || '').trim();
const tmdbApiKey = (process.env.TMDB_API_KEY || '').trim();

// Parse CLI flags
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const forceRefresh = args.includes('--force');

const sampleArg = args.find(a => a.startsWith('--sample='));
const sampleCount = sampleArg ? parseInt(sampleArg.split('=')[1], 10) : null;

const idsArg = args.find(a => a.startsWith('--ids='));
const targetIds = idsArg ? idsArg.split('=')[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : null;

const concurrencyArg = args.find(a => a.startsWith('--concurrency='));
const CONCURRENCY = concurrencyArg ? parseInt(concurrencyArg.split('=')[1], 10) || 5 : 5;

const delayArg = args.find(a => a.startsWith('--delay='));
const REQUEST_DELAY_MS = delayArg ? parseInt(delayArg.split('=')[1], 10) || 50 : 50;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch single movie metadata from TMDB with retry & backoff
async function fetchTmdbMovie(tmdbId, retries = 3) {
    const url = `${TMDB_BASE_URL}/movie/${tmdbId}?language=en-US`;
    const headers = {
        'Accept': 'application/json',
    };

    if (tmdbToken) {
        headers['Authorization'] = `Bearer ${tmdbToken}`;
    }

    const requestUrl = (!tmdbToken && tmdbApiKey)
        ? `${url}&api_key=${tmdbApiKey}`
        : url;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);

            const res = await fetch(requestUrl, {
                headers,
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (res.status === 200) {
                const data = await res.json();
                return { status: 200, data };
            }

            if (res.status === 404) {
                return { status: 404, data: null };
            }

            if (res.status === 401) {
                return { status: 401, error: 'Unauthorized: Invalid or expired TMDB token.' };
            }

            if (res.status === 429) {
                // Rate limited - inspect Retry-After or backoff
                const retryAfter = parseInt(res.headers.get('retry-after') || '2', 10);
                const waitMs = Math.max(retryAfter * 1000, attempt * 1500);
                console.warn(`[TMDB] Rate limit (429) on ID ${tmdbId}. Waiting ${waitMs}ms before retry ${attempt}/${retries}...`);
                await sleep(waitMs);
                continue;
            }

            // 5xx server errors
            if (res.status >= 500) {
                console.warn(`[TMDB] Server error (${res.status}) on ID ${tmdbId}. Retrying ${attempt}/${retries}...`);
                await sleep(1000 * attempt);
                continue;
            }

            return { status: res.status, error: `HTTP ${res.status}: ${res.statusText}` };
        } catch (err) {
            if (err.name === 'AbortError') {
                console.warn(`[TMDB] Request timed out on ID ${tmdbId}. Retrying ${attempt}/${retries}...`);
            } else {
                console.warn(`[TMDB] Network error on ID ${tmdbId}: ${err.message}. Retrying ${attempt}/${retries}...`);
            }
            if (attempt === retries) {
                return { status: 0, error: err.message };
            }
            await sleep(1000 * attempt);
        }
    }

    return { status: 0, error: 'Max retries exceeded' };
}

// Clean extraction of approved discovery/presentation fields
function extractEnrichmentData(tmdbData) {
    if (!tmdbData) return null;

    const poster_path = tmdbData.poster_path ? String(tmdbData.poster_path).trim() : null;
    const backdrop_path = tmdbData.backdrop_path ? String(tmdbData.backdrop_path).trim() : null;

    const genres = Array.isArray(tmdbData.genres)
        ? tmdbData.genres.map(g => (typeof g === 'string' ? g : g.name)).filter(Boolean)
        : [];

    const vote_average = typeof tmdbData.vote_average === 'number' && !isNaN(tmdbData.vote_average)
        ? Math.round(tmdbData.vote_average * 10) / 10
        : null;

    const popularity = typeof tmdbData.popularity === 'number' && !isNaN(tmdbData.popularity)
        ? Math.round(tmdbData.popularity * 10) / 10
        : null;

    return {
        poster_path,
        backdrop_path,
        genres,
        vote_average,
        popularity
    };
}

async function runEnrichment() {
    console.log('==================================================');
    console.log(' CineMatch — Phase 2A TMDB Metadata Enrichment');
    console.log('==================================================');

    if (isDryRun) {
        console.log('MODE: DRY-RUN (Database writes disabled)');
    } else {
        console.log('MODE: LIVE UPDATE (Database will be updated)');
    }

    const hasAuth = Boolean(tmdbToken || tmdbApiKey);
    if (!hasAuth) {
        console.warn('\n[Warning] Neither TMDB_ACCESS_TOKEN nor TMDB_API_KEY is configured in Backend/.env.');
        console.warn('To enrich metadata from TMDB, add TMDB_ACCESS_TOKEN to Backend/.env:');
        console.warn('  TMDB_ACCESS_TOKEN=your_v4_read_access_token\n');
        if (!isDryRun) {
            console.error('[Error] Live enrichment requires TMDB authentication. Aborting.');
            process.exit(1);
        }
    }

    console.log(`[Database] Connecting to MongoDB...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Database] Connected successfully.');

    const totalBefore = await Movie.countDocuments();
    console.log(`[Database] Total movie records in MongoDB before enrichment: ${totalBefore}`);

    // Build query
    let query = {};
    if (targetIds && targetIds.length > 0) {
        query = { id: { $in: targetIds } };
        console.log(`[Filter] Targeting specific movie IDs (${targetIds.length}): ${targetIds.join(', ')}`);
    }

    let cursor = Movie.find(query).sort({ id: 1 });
    if (sampleCount && sampleCount > 0) {
        cursor = cursor.limit(sampleCount);
        console.log(`[Filter] Sample limit active: first ${sampleCount} movies`);
    }

    const moviesToProcess = await cursor.lean();
    console.log(`[Catalog] Found ${moviesToProcess.length} movies to evaluate.\n`);

    if (moviesToProcess.length === 0) {
        console.log('[Catalog] No movies matched the criteria. Exiting.');
        await mongoose.disconnect();
        return;
    }

    // Counters for final reporting
    let processed = 0;
    let successful = 0;
    let skipped = 0;
    let notFound = 0;
    let failed = 0;
    let missingPoster = 0;
    let missingBackdrop = 0;

    // Process in batches with controlled concurrency
    for (let i = 0; i < moviesToProcess.length; i += CONCURRENCY) {
        const batch = moviesToProcess.slice(i, i + CONCURRENCY);

        await Promise.all(batch.map(async (movie) => {
            processed++;
            const idxStr = String(processed).padStart(4, '0');
            const totalStr = String(moviesToProcess.length).padStart(4, '0');

            // Check if already enriched
            const isAlreadyEnriched = movie.poster_path && movie.genres && movie.genres.length > 0;
            if (isAlreadyEnriched && !forceRefresh) {
                skipped++;
                console.log(`[${idxStr}/${totalStr}] ${movie.title} (ID: ${movie.id}) → skipped (already enriched)`);
                return;
            }

            if (!hasAuth) {
                // Dry run without auth: validate movie integrity only
                console.log(`[${idxStr}/${totalStr}] ${movie.title} (ID: ${movie.id}) → validated (no TMDB token provided for live fetch)`);
                return;
            }

            // Query TMDB
            const res = await fetchTmdbMovie(movie.id);

            if (res.status === 401) {
                console.error(`[${idxStr}/${totalStr}] ${movie.title} (ID: ${movie.id}) → 401 Unauthorized. Stopping run.`);
                failed++;
                process.exit(1);
            }

            if (res.status === 404) {
                notFound++;
                console.log(`[${idxStr}/${totalStr}] ${movie.title} (ID: ${movie.id}) → 404 Not Found on TMDB`);
                return;
            }

            if (res.status !== 200 || !res.data) {
                failed++;
                console.warn(`[${idxStr}/${totalStr}] ${movie.title} (ID: ${movie.id}) → Error: ${res.error || 'Unknown'}`);
                return;
            }

            const enriched = extractEnrichmentData(res.data);
            if (!enriched.poster_path) missingPoster++;
            if (!enriched.backdrop_path) missingBackdrop++;

            successful++;

            const summaryLine = `poster: ${enriched.poster_path || 'null'}, genres: [${enriched.genres.slice(0, 2).join(', ')}${enriched.genres.length > 2 ? '...' : ''}], rating: ${enriched.vote_average}`;

            if (isDryRun) {
                console.log(`[${idxStr}/${totalStr}] ${movie.title} (ID: ${movie.id}) → [DRY-RUN] would update (${summaryLine})`);
            } else {
                // Update MongoDB document by ID with upsert: false
                await Movie.updateOne(
                    { id: movie.id },
                    { $set: enriched },
                    { upsert: false }
                );
                console.log(`[${idxStr}/${totalStr}] ${movie.title} (ID: ${movie.id}) → enriched (${summaryLine})`);
            }
        }));

        if (REQUEST_DELAY_MS > 0 && i + CONCURRENCY < moviesToProcess.length) {
            await sleep(REQUEST_DELAY_MS);
        }
    }

    console.log('\n==================================================');
    console.log(' Enrichment Execution Summary');
    console.log('==================================================');
    console.log(`Total movies evaluated:     ${processed}`);
    console.log(`Successfully enriched:      ${successful}`);
    console.log(`Skipped (already enriched): ${skipped}`);
    console.log(`Not found on TMDB (404):    ${notFound}`);
    console.log(`Failed / network errors:    ${failed}`);
    console.log(`Movies missing poster:      ${missingPoster}`);
    console.log(`Movies missing backdrop:    ${missingBackdrop}`);

    const totalAfter = await Movie.countDocuments();
    console.log(`\n[Database] Total documents before: ${totalBefore}`);
    console.log(`[Database] Total documents after:  ${totalAfter}`);
    if (totalBefore === totalAfter) {
        console.log('[Integrity] VERIFIED: Document count remained unchanged (no duplicates created).');
    } else {
        console.error(`[Integrity] WARNING: Document count changed from ${totalBefore} to ${totalAfter}!`);
    }

    await mongoose.disconnect();
    console.log('[Database] Disconnected. Enrichment run complete.');
}

if (require.main === module) {
    runEnrichment().catch(err => {
        console.error('[Fatal Error]', err);
        process.exit(1);
    });
}

module.exports = {
    fetchTmdbMovie,
    extractEnrichmentData,
    runEnrichment
};
