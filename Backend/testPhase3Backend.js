require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:3050';

async function runTests() {
    console.log('=== CineMatch Phase 3 Backend Verification Suite ===\n');

    let passed = 0;
    let failed = 0;

    async function test(name, fn) {
        try {
            await fn();
            console.log(`[PASS] ${name}`);
            passed++;
        } catch (err) {
            console.error(`[FAIL] ${name}:`, err.message);
            if (err.response) {
                console.error('Response data:', err.response.data);
            }
            failed++;
        }
    }

    // 1. GET /api/movies default
    await test('1. GET /api/movies returns default page (24 movies)', async () => {
        const res = await axios.get(`${BASE_URL}/api/movies`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        if (!Array.isArray(res.data.movies)) throw new Error('movies is not an array');
        if (res.data.movies.length !== 24) throw new Error(`Expected 24 movies, got ${res.data.movies.length}`);
        if (res.data.pagination.page !== 1) throw new Error('Expected page 1');
        if (res.data.pagination.total !== 4803) throw new Error(`Expected total 4803, got ${res.data.pagination.total}`);
        if (!res.data.pagination.hasNextPage) throw new Error('Expected hasNextPage to be true');
    });

    // 2. Pagination
    await test('2. Pagination page=2&limit=10', async () => {
        const res = await axios.get(`${BASE_URL}/api/movies?page=2&limit=10`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        if (res.data.movies.length !== 10) throw new Error(`Expected 10 movies, got ${res.data.movies.length}`);
        if (res.data.pagination.page !== 2) throw new Error('Expected page 2');
        if (res.data.pagination.limit !== 10) throw new Error('Expected limit 10');
        if (!res.data.pagination.hasPrevPage) throw new Error('Expected hasPrevPage to be true');
    });

    // 3. Search: Avatar, avatar, AVATAR, leading/trailing space
    await test('3. Search case-insensitivity (Avatar, avatar, AVATAR)', async () => {
        const res1 = await axios.get(`${BASE_URL}/api/movies?search=Avatar`);
        const res2 = await axios.get(`${BASE_URL}/api/movies?search=avatar`);
        const res3 = await axios.get(`${BASE_URL}/api/movies?search=AVATAR`);
        const res4 = await axios.get(`${BASE_URL}/api/movies?search=%20Avatar%20`);

        if (res1.data.pagination.total !== res2.data.pagination.total ||
            res2.data.pagination.total !== res3.data.pagination.total ||
            res3.data.pagination.total !== res4.data.pagination.total) {
            throw new Error(`Totals do not match: ${res1.data.pagination.total}, ${res2.data.pagination.total}, ${res3.data.pagination.total}, ${res4.data.pagination.total}`);
        }
        const hasAvatar = res1.data.movies.some(m => m.title === 'Avatar');
        if (!hasAvatar) throw new Error('Avatar not found in search results');
    });

    // 4. Genre filtering
    await test('4. Genre filtering (genre=Action)', async () => {
        const res = await axios.get(`${BASE_URL}/api/movies?genre=Action&limit=10`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        if (res.data.movies.length === 0) throw new Error('No action movies returned');
        const allAction = res.data.movies.every(m => m.genres && m.genres.includes('Action'));
        if (!allAction) throw new Error('Returned movie missing Action genre');
    });

    // 5. Rating filtering
    await test('5. Rating filtering (minRating=8)', async () => {
        const res = await axios.get(`${BASE_URL}/api/movies?minRating=8&limit=15`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        if (res.data.movies.length === 0) throw new Error('No movies returned for minRating=8');
        const allHigh = res.data.movies.every(m => m.vote_average >= 8);
        if (!allHigh) throw new Error('Movie with rating < 8 returned');
    });

    // 6. Year filtering
    await test('6. Year filtering (year=2009)', async () => {
        const res = await axios.get(`${BASE_URL}/api/movies?year=2009&limit=20`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        const all2009 = res.data.movies.every(m => {
            const yr = new Date(m.release_date).getUTCFullYear();
            return yr === 2009;
        });
        if (!all2009) throw new Error('Returned movie not from 2009');
    });

    // 7. Sorting
    await test('7. Sorting (rating_desc and title_asc)', async () => {
        const resRating = await axios.get(`${BASE_URL}/api/movies?sort=rating_desc&limit=10`);
        for (let i = 0; i < resRating.data.movies.length - 1; i++) {
            if (resRating.data.movies[i].vote_average < resRating.data.movies[i + 1].vote_average) {
                throw new Error('rating_desc order violated');
            }
        }

        const resTitle = await axios.get(`${BASE_URL}/api/movies?sort=title_asc&limit=10`);
        for (let i = 0; i < resTitle.data.movies.length - 1; i++) {
            const t1 = resTitle.data.movies[i].title;
            const t2 = resTitle.data.movies[i + 1].title;
            if (t1 > t2) {
                throw new Error(`title_asc order violated: "${t1}" > "${t2}"`);
            }
        }
    });

    // 8. Combined search + filter + sort
    await test('8. Combined query (search=dark&genre=Action&sort=rating_desc)', async () => {
        const res = await axios.get(`${BASE_URL}/api/movies?search=dark&genre=Action&sort=rating_desc&limit=10`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        if (res.data.movies.length === 0) throw new Error('No movies returned for combined query');
        const matches = res.data.movies.every(m =>
            m.title.toLowerCase().includes('dark') &&
            m.genres.includes('Action')
        );
        if (!matches) throw new Error('Combined filter criteria violated in returned results');
    });

    // 9. Invalid pagination values
    await test('9. Invalid pagination values return 400', async () => {
        try {
            await axios.get(`${BASE_URL}/api/movies?page=-1`);
            throw new Error('Should have failed for page=-1');
        } catch (e) {
            if (e.response?.status !== 400) throw e;
        }

        try {
            await axios.get(`${BASE_URL}/api/movies?limit=500`);
            throw new Error('Should have failed for limit=500');
        } catch (e) {
            if (e.response?.status !== 400) throw e;
        }
    });

    // 10. Invalid sort value
    await test('10. Invalid sort value returns 400', async () => {
        try {
            await axios.get(`${BASE_URL}/api/movies?sort=invalid_sort_key`);
            throw new Error('Should have failed for invalid sort');
        } catch (e) {
            if (e.response?.status !== 400) throw e;
        }
    });

    // 11. Empty result
    await test('11. Non-matching search returns empty array and total=0', async () => {
        const res = await axios.get(`${BASE_URL}/api/movies?search=xyznonexistentmovie123456789`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        if (res.data.movies.length !== 0) throw new Error('Expected 0 movies');
        if (res.data.pagination.total !== 0) throw new Error('Expected total 0');
    });

    // 12. Existing recommendation endpoint: Avatar and Inception
    await test('12. Existing recommendation endpoint (Avatar and Inception)', async () => {
        const resAvatar = await axios.get(`${BASE_URL}/api/movies/Avatar`);
        if (resAvatar.status !== 200) throw new Error(`Status ${resAvatar.status}`);
        if (!Array.isArray(resAvatar.data) || resAvatar.data.length !== 6) {
            throw new Error(`Expected 6 recommendations for Avatar, got ${resAvatar.data?.length}`);
        }

        const resInception = await axios.get(`${BASE_URL}/api/movies/Inception`);
        if (resInception.status !== 200) throw new Error(`Status ${resInception.status}`);
        if (!Array.isArray(resInception.data) || resInception.data.length !== 6) {
            throw new Error(`Expected 6 recommendations for Inception, got ${resInception.data?.length}`);
        }
    });

    // Extra: GET /api/genres
    await test('Extra: GET /api/genres returns sorted genre list', async () => {
        const res = await axios.get(`${BASE_URL}/api/genres`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        if (!Array.isArray(res.data) || res.data.length < 15) {
            throw new Error(`Expected at least 15 genres, got ${res.data?.length}`);
        }
    });

    console.log(`\n=== Suite Completed: ${passed} passed, ${failed} failed ===`);
    if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
