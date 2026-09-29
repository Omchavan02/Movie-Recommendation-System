const assert = require('assert');
const Movie = require('./models/Movie');
const { extractEnrichmentData } = require('./enrichTmdb');

function runChecks() {
    console.log('[Check] Verifying Movie schema paths...');
    const paths = Movie.schema.paths;
    
    // Existing fields
    assert(paths.id, 'id missing');
    assert(paths.title, 'title missing');
    assert(paths.tagline, 'tagline missing');
    assert(paths.release_date, 'release_date missing');
    assert(paths.runtime, 'runtime missing');
    assert(paths.overview, 'overview missing');
    assert(paths.homepage, 'homepage missing');

    // Phase 2A fields
    assert(paths.poster_path, 'poster_path missing');
    assert(paths.backdrop_path, 'backdrop_path missing');
    assert(paths.genres, 'genres missing');
    assert(paths.vote_average, 'vote_average missing');
    assert(paths.popularity, 'popularity missing');
    console.log('✓ Schema check passed: all 12 fields defined.');

    console.log('[Check] Verifying full TMDB response extraction...');
    const fullData = {
        poster_path: '/8UlWHLM29bYHGQY0io9XYnx0dYw.jpg',
        backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
        genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }],
        vote_average: 7.571,
        popularity: 89.324
    };
    const res1 = extractEnrichmentData(fullData);
    assert.strictEqual(res1.poster_path, '/8UlWHLM29bYHGQY0io9XYnx0dYw.jpg');
    assert.strictEqual(res1.backdrop_path, '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg');
    assert.deepStrictEqual(res1.genres, ['Action', 'Adventure', 'Fantasy']);
    assert.strictEqual(res1.vote_average, 7.6);
    assert.strictEqual(res1.popularity, 89.3);
    console.log('✓ Full extraction passed.');

    console.log('[Check] Verifying edge-case / missing data sanitization...');
    const partialData = {
        poster_path: null,
        backdrop_path: '',
        genres: null,
        vote_average: undefined,
        popularity: 'invalid'
    };
    const res2 = extractEnrichmentData(partialData);
    assert.strictEqual(res2.poster_path, null);
    assert.strictEqual(res2.backdrop_path, null);
    assert.deepStrictEqual(res2.genres, []);
    assert.strictEqual(res2.vote_average, null);
    assert.strictEqual(res2.popularity, null);
    console.log('✓ Edge-case sanitization passed.');

    console.log('\n[PASS] All enrichment self-checks passed successfully.');
}

runChecks();
