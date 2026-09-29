require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const csvPath = path.resolve(__dirname, '..', 'ML_Model', 'movies.csv');
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinemas';
const isDryRun = process.argv.includes('--dry-run');

// RFC 4180 compliant CSV parser
function parseCSV(content) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
        const c = content[i];
        const next = content[i + 1];

        if (inQuotes) {
            if (c === '"' && next === '"') {
                field += '"';
                i++;
            } else if (c === '"') {
                inQuotes = false;
            } else {
                field += c;
            }
        } else {
            if (c === '"') {
                inQuotes = true;
            } else if (c === ',') {
                row.push(field);
                field = '';
            } else if (c === '\r' && next === '\n') {
                row.push(field);
                rows.push(row);
                row = [];
                field = '';
                i++;
            } else if (c === '\n' || c === '\r') {
                row.push(field);
                rows.push(row);
                row = [];
                field = '';
            } else {
                field += c;
            }
        }
    }

    if (field || row.length > 0) {
        row.push(field);
        rows.push(row);
    }

    return rows;
}

async function runSeed() {
    console.log(`[Seed] Checking source CSV: ${csvPath}`);
    if (!fs.existsSync(csvPath)) {
        console.error(`[Seed] Error: Source CSV not found at ${csvPath}`);
        process.exit(1);
    }

    console.log('[Seed] Reading and parsing CSV dataset...');
    const rawContent = fs.readFileSync(csvPath, 'utf8');
    const parsedRows = parseCSV(rawContent);

    if (parsedRows.length < 2) {
        console.error('[Seed] Error: CSV file contains no data rows.');
        process.exit(1);
    }

    const headers = parsedRows[0].map(h => h.trim());
    const idIdx = headers.indexOf('id');
    const titleIdx = headers.indexOf('title');
    const taglineIdx = headers.indexOf('tagline');
    const releaseDateIdx = headers.indexOf('release_date');
    const runtimeIdx = headers.indexOf('runtime');
    const overviewIdx = headers.indexOf('overview');
    const homepageIdx = headers.indexOf('homepage');

    if (idIdx === -1 || titleIdx === -1) {
        console.error('[Seed] Error: Required columns (id, title) not found in CSV header.');
        process.exit(1);
    }

    console.log(`[Seed] Parsed ${parsedRows.length - 1} data rows from CSV.`);

    const movies = [];
    const seenIds = new Set();
    let missingTaglines = 0;
    let missingReleaseDates = 0;
    let missingRuntimes = 0;
    let missingOverviews = 0;
    let missingHomepages = 0;
    let duplicateIds = 0;

    for (let i = 1; i < parsedRows.length; i++) {
        const row = parsedRows[i];
        if (!row || row.length < headers.length) continue;

        const rawId = row[idIdx] ? row[idIdx].trim() : '';
        const id = parseInt(rawId, 10);
        const title = row[titleIdx] ? row[titleIdx].trim() : '';

        if (isNaN(id) || !title) continue;

        if (seenIds.has(id)) {
            duplicateIds++;
            continue;
        }
        seenIds.add(id);

        const tagline = row[taglineIdx] ? row[taglineIdx].trim() : '';
        if (!tagline) missingTaglines++;

        const rawDate = row[releaseDateIdx] ? row[releaseDateIdx].trim() : '';
        let releaseDate = null;
        if (rawDate) {
            const parsedDate = new Date(rawDate);
            if (!isNaN(parsedDate.getTime())) {
                releaseDate = parsedDate;
            }
        }
        if (!releaseDate) missingReleaseDates++;

        const rawRuntime = row[runtimeIdx] ? row[runtimeIdx].trim() : '';
        const runtime = rawRuntime ? parseFloat(rawRuntime) || 0 : 0;
        if (!runtime) missingRuntimes++;

        const overview = row[overviewIdx] ? row[overviewIdx].trim() : '';
        if (!overview) missingOverviews++;

        const homepage = row[homepageIdx] ? row[homepageIdx].trim() : '';
        if (!homepage) missingHomepages++;

        movies.push({
            id,
            title,
            tagline,
            release_date: releaseDate,
            runtime,
            overview,
            homepage
        });
    }

    console.log('=== Dataset Validation Summary ===');
    console.log(`Total valid unique movies: ${movies.length}`);
    console.log(`Duplicate IDs skipped:     ${duplicateIds}`);
    console.log(`Missing taglines:          ${missingTaglines}`);
    console.log(`Missing release dates:     ${missingReleaseDates}`);
    console.log(`Missing runtimes:          ${missingRuntimes}`);
    console.log(`Missing overviews:         ${missingOverviews}`);
    console.log(`Missing homepages:         ${missingHomepages}`);

    const avatar = movies.find(m => m.id === 19995);
    if (avatar) {
        console.log('[Seed] Sample verification: Avatar (ID: 19995) verified in dataset.');
    }

    if (isDryRun) {
        console.log('[Seed] Dry run mode requested (--dry-run). Skipping MongoDB insertion.');
        process.exit(0);
    }

    console.log(`[Seed] Connecting to MongoDB: ${mongoUri.replace(/:([^:@]{3,})@/, ':****@')}`);
    try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log('[Seed] MongoDB connection established successfully.');

        console.log('[Seed] Executing idempotent bulk upsert in batches of 500...');
        const batchSize = 500;
        let processed = 0;

        for (let i = 0; i < movies.length; i += batchSize) {
            const batch = movies.slice(i, i + batchSize);
            const operations = batch.map(doc => ({
                updateOne: {
                    filter: { id: doc.id },
                    update: { $set: doc },
                    upsert: true
                }
            }));

            await Movie.bulkWrite(operations, { ordered: false });
            processed += batch.length;
            process.stdout.write(`\r[Seed] Progress: ${processed} / ${movies.length} movies processed...`);
        }

        console.log('\n[Seed] Bulk upsert completed.');
        const totalInDb = await Movie.countDocuments();
        console.log(`[Seed] Total documents in MongoDB 'movies' collection: ${totalInDb}`);

        await mongoose.disconnect();
        console.log('[Seed] Disconnected from MongoDB. Seed finished successfully.');
    } catch (err) {
        console.error(`[Seed] MongoDB connection/operation failed: ${err.message}`);
        console.log('[Seed] Note: If local MongoDB is offline, configure MONGODB_URI to connect to MongoDB Atlas.');
        process.exit(1);
    }
}

runSeed();
