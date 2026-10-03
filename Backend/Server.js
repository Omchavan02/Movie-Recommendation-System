// Import required modules
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') })
const express = require('express') 
const axios = require('axios') 
const mongoose = require('mongoose') 
const cors = require('cors')

// ── Django cold-start configuration ──────────────────────────────────────────
// Render free-tier services take ~60 s to wake from idle.
// Strategy: poll /api/health/ with a hard wall-clock deadline, then make
// exactly ONE recommendation request once the service is confirmed ready.
const DJANGO_HEALTH_POLL_INTERVAL_MS = 5_000   // gap between consecutive health polls
const DJANGO_HEALTH_POLL_TIMEOUT_MS  = 5_000   // per-poll Axios timeout
const DJANGO_HEALTH_DEADLINE_MS      = 90_000  // hard wall-clock ceiling for health wait
const DJANGO_REQUEST_TIMEOUT_MS      = 20_000  // single recommendation request timeout

/** Returns true for failures that are plausibly transient (cold-start / proxy hiccup). */
function isDjangoTransient(error) {
    if (!error.response) {
        // Network-level failure: connection refused, reset, or timeout
        const code = error.code || ''
        return ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNABORTED'].includes(code)
    }
    const status = error.response.status
    return status === 502 || status === 503 || status === 504
}

/** Promisified sleep. */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Polls Django GET /api/health/ until it returns HTTP 200 or the hard
 * wall-clock deadline (DJANGO_HEALTH_DEADLINE_MS) is reached.
 *
 * The deadline is checked against Date.now() — not a fixed poll count —
 * so the total wait is bounded by elapsed time regardless of per-poll
 * response latency or sleep jitter.
 *
 * Each poll's Axios timeout is capped to the remaining budget so a single
 * slow request cannot cause the total wait to exceed the deadline.
 *
 * Returns when Django is healthy. Throws on deadline or permanent error.
 */
async function djangoWaitForHealth() {
    const healthUrl = `${djangoUrl}/api/health/`
    const deadline = Date.now() + DJANGO_HEALTH_DEADLINE_MS
    let pollCount = 0

    while (Date.now() < deadline) {
        pollCount++
        // Cap per-poll timeout to remaining budget — prevents a single slow
        // request from pushing total elapsed time past the deadline.
        const remaining = deadline - Date.now()
        const pollTimeout = Math.min(DJANGO_HEALTH_POLL_TIMEOUT_MS, remaining)

        try {
            await axios.get(healthUrl, { timeout: pollTimeout })
            // HTTP 200 — Django is ready
            if (pollCount > 1) {
                console.log(`[Django] Service healthy after ${pollCount} health poll(s)`)
            }
            return
        } catch (err) {
            if (!isDjangoTransient(err)) {
                // Permanent error on the health endpoint (e.g. 404 = wrong URL)
                const statusStr = err.response ? err.response.status : err.code
                console.log(`[Django] Health check: non-transient error (${statusStr}), aborting wait`)
                throw err
            }
            const statusStr = err.response ? err.response.status : err.code
            const remainingAfterPoll = deadline - Date.now()
            if (remainingAfterPoll <= 0) {
                // Deadline was reached or exceeded during/after the poll
                console.log(`[Django] Health check: deadline reached after ${pollCount} poll(s)`)
                throw err
            }
            // Sleep for the interval, but never past the deadline
            const sleepMs = Math.min(DJANGO_HEALTH_POLL_INTERVAL_MS, remainingAfterPoll)
            console.log(
                `[Django] Health poll ${pollCount} (${statusStr}), ` +
                `retrying in ${Math.round(sleepMs / 1000)}s ` +
                `(${Math.round(remainingAfterPoll / 1000)}s remaining)`
            )
            await sleep(sleepMs)
        }
    }
    // while-condition was false before starting a new poll (deadline passed
    // exactly between the sleep returning and the next loop check)
    console.log(`[Django] Health check: deadline exceeded after ${pollCount} poll(s)`)
    throw new Error('Django service did not become healthy within the deadline')
}

/**
 * Makes exactly ONE recommendation request to Django.
 * Call djangoWaitForHealth() first to confirm Django is ready.
 */
async function djangoGetRecommended(movieId) {
    const url = `${djangoUrl}/api/recommended/${movieId}/`
    console.log('[Django] Sending recommendation request')
    const response = await axios.get(url, { timeout: DJANGO_REQUEST_TIMEOUT_MS })
    console.log('[Django] Recommendation request succeeded')
    return response
}

// Initialize the Express application
const app = express()
const port = process.env.PORT || 3050;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinemas'
const djangoUrl = (process.env.DJANGO_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')

// Import the Movie model for MongoDB operations
const Movie = require('./models/Movie')

// Use CORS middleware to allow cross-origin requests
app.use(cors())
app.use(express.json())

// Connect to MongoDB database
mongoose.connect(mongoUri).catch((err) => {
    console.error('MongoDB connection error:', err.message)
})

// Get the connection instance
const db = mongoose.connection

// Log an error message if there is a connection error
db.on('error', console.error.bind(console, 'connection error:'))

// Log a success message when the connection is established
db.once('open', () => {
    console.log('Connected to MongoDB')
})

// Define a health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'express-backend',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    })
})

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Supported catalog sort options mapping to MongoDB sort specifications
const CATALOG_SORT_OPTIONS = {
    popularity_desc: { popularity: -1, vote_average: -1, _id: 1 },
    popularity_asc: { popularity: 1, _id: 1 },
    rating_desc: { vote_average: -1, popularity: -1, _id: 1 },
    rating_asc: { vote_average: 1, popularity: -1, _id: 1 },
    year_desc: { release_date: -1, popularity: -1, _id: 1 },
    year_asc: { release_date: 1, popularity: -1, _id: 1 },
    title_asc: { title: 1, _id: 1 },
    title_desc: { title: -1, _id: 1 },
};

const SORT_ALIASES = {
    popularity: 'popularity_desc',
    rating: 'rating_desc',
    year: 'year_desc',
    title: 'title_asc',
};

// GET /api/genres - Retrieve list of unique movie genres present in catalog
app.get('/api/genres', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database service unavailable. Please ensure MongoDB is running.' });
        }
        const genres = await Movie.distinct('genres');
        const cleanGenres = genres.filter(Boolean).sort();
        res.json(cleanGenres);
    } catch (error) {
        console.error('Error fetching genres:', error.message);
        res.status(500).json({ error: 'Failed to retrieve movie genres.' });
    }
});

// GET /api/movies - Paginated, searchable, filterable, and sortable movie catalog
app.get('/api/movies', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database service unavailable. Please ensure MongoDB is running.' });
        }

        // 1. Pagination Validation
        let page = 1;
        if (req.query.page !== undefined && req.query.page !== '') {
            const parsedPage = parseInt(req.query.page, 10);
            if (isNaN(parsedPage) || parsedPage < 1 || String(parsedPage) !== String(req.query.page).trim()) {
                return res.status(400).json({ error: 'Invalid page parameter. Must be a positive integer.' });
            }
            page = parsedPage;
        }

        let limit = 24;
        if (req.query.limit !== undefined && req.query.limit !== '') {
            const parsedLimit = parseInt(req.query.limit, 10);
            if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100 || String(parsedLimit) !== String(req.query.limit).trim()) {
                return res.status(400).json({ error: 'Invalid limit parameter. Must be an integer between 1 and 100.' });
            }
            limit = parsedLimit;
        }

        // 2. Sort Validation
        let sortKey = 'popularity_desc';
        if (req.query.sort !== undefined && req.query.sort !== '') {
            const rawSort = String(req.query.sort).trim();
            const resolvedSort = SORT_ALIASES[rawSort] || rawSort;
            if (!CATALOG_SORT_OPTIONS[resolvedSort]) {
                const validOptions = Object.keys(CATALOG_SORT_OPTIONS).concat(Object.keys(SORT_ALIASES));
                return res.status(400).json({
                    error: `Invalid sort parameter. Allowed values: ${validOptions.join(', ')}`
                });
            }
            sortKey = resolvedSort;
        }
        const sortSpec = CATALOG_SORT_OPTIONS[sortKey];

        // 3. Query Construction
        const query = {};

        // Search by movie title (case-insensitive, whitespace-trimmed, regex-escaped)
        if (req.query.search && typeof req.query.search === 'string') {
            const cleanSearch = req.query.search.trim();
            if (cleanSearch) {
                query.title = { $regex: new RegExp(escapeRegex(cleanSearch), 'i') };
            }
        }

        // Genre filter (case-insensitive exact match against array element)
        if (req.query.genre && typeof req.query.genre === 'string') {
            const cleanGenre = req.query.genre.trim();
            if (cleanGenre && cleanGenre.toLowerCase() !== 'all') {
                query.genres = { $regex: new RegExp(`^${escapeRegex(cleanGenre)}$`, 'i') };
            }
        }

        // Minimum rating filter
        if (req.query.minRating !== undefined && req.query.minRating !== '') {
            const minRating = parseFloat(req.query.minRating);
            if (isNaN(minRating) || minRating < 0 || minRating > 10) {
                return res.status(400).json({ error: 'Invalid minRating parameter. Must be a number between 0 and 10.' });
            }
            query.vote_average = { $gte: minRating };
        }

        // Year filter or year range
        if (req.query.year !== undefined && req.query.year !== '') {
            const year = parseInt(req.query.year, 10);
            if (isNaN(year) || year < 1880 || year > 2100) {
                return res.status(400).json({ error: 'Invalid year parameter. Must be a valid 4-digit year.' });
            }
            query.release_date = {
                $gte: new Date(Date.UTC(year, 0, 1)),
                $lte: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999))
            };
        } else if (req.query.minYear !== undefined || req.query.maxYear !== undefined) {
            const dateRange = {};
            if (req.query.minYear !== undefined && req.query.minYear !== '') {
                const minY = parseInt(req.query.minYear, 10);
                if (isNaN(minY) || minY < 1880 || minY > 2100) {
                    return res.status(400).json({ error: 'Invalid minYear parameter.' });
                }
                dateRange.$gte = new Date(Date.UTC(minY, 0, 1));
            }
            if (req.query.maxYear !== undefined && req.query.maxYear !== '') {
                const maxY = parseInt(req.query.maxYear, 10);
                if (isNaN(maxY) || maxY < 1880 || maxY > 2100) {
                    return res.status(400).json({ error: 'Invalid maxYear parameter.' });
                }
                dateRange.$lte = new Date(Date.UTC(maxY, 11, 31, 23, 59, 59, 999));
            }
            if (Object.keys(dateRange).length > 0) {
                query.release_date = dateRange;
            }
        }

        // 4. Database Query Execution
        const total = await Movie.countDocuments(query);
        const totalPages = Math.ceil(total / limit) || 1;
        const skip = (page - 1) * limit;

        const movies = await Movie.find(query)
            .sort(sortSpec)
            .skip(skip)
            .limit(limit)
            .lean();

        res.json({
            movies,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching catalog movies:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching the movie catalog.' });
    }
});

// GET /api/movie/details/:movieName - Fetch full details for a single movie by title (case-insensitive)
app.get('/api/movie/details/:movieName', async (req, res) => {
    const rawMovieName = req.params.movieName || ''
    const movieName = rawMovieName.trim()

    try {
        if (!movieName) {
            return res.status(400).json({ error: 'Movie name is required' })
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database service unavailable. Please ensure MongoDB is running.' })
        }

        const escaped = escapeRegex(movieName)
        const movie = await Movie.findOne({ title: { $regex: new RegExp(`^${escaped}$`, 'i') } }).lean()

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' })
        }

        res.json(movie)
    } catch (error) {
        console.error(`Error fetching movie details: ${error.message}`)
        res.status(500).json({ error: 'An error occurred while fetching movie details.' })
    }
})

// Define a route to handle GET requests to '/api/movies/:movieName'
app.get('/api/movies/:movieName', async (req, res) => {
    const rawMovieName = req.params.movieName || ''
    const movieName = rawMovieName.trim()

    try {
        if (!movieName) {
            return res.status(400).json({ error: 'Movie name is required' })
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database service unavailable. Please ensure MongoDB is running.' })
        }

        console.log(`Searching for movie: ${movieName}`)

        // Find a movie in MongoDB with case-insensitive exact title match
        const escaped = escapeRegex(movieName)
        const movie = await Movie.findOne({ title: { $regex: new RegExp(`^${escaped}$`, 'i') } })

        // If no movie is found, send a 404 response with an error message
        if (!movie) {
            console.log(`Movie not found: ${movieName}`)
            return res.status(404).json({ error: 'Movie not found' })
        }

        console.log(`Movie found: ${movie.title} with ID: ${movie.id}`) 

        // Ensure Django is awake, then make exactly one recommendation request
        await djangoWaitForHealth()
        const djangoResponse = await djangoGetRecommended(movie.id)

        // Extract recommended movie IDs from the Django API response
        const recommendedMovieIds = djangoResponse.data.recommended_movies

        // Find the recommended movies in the MongoDB database using the recommended movie IDs
        const recommendedMovies = await Movie.find({ id: { $in: recommendedMovieIds } }).lean()

        // Preserve exact Django ML cosine similarity ranking order
        const movieMap = new Map(recommendedMovies.map((m) => [m.id, m]))
        const orderedMovies = (recommendedMovieIds || [])
            .map((id) => movieMap.get(id))
            .filter(Boolean)

        // Send the list of recommended movies as the JSON response
        res.json(orderedMovies)
    } catch (error) {
        console.error(`An error occurred: ${error.message}`) 

        // Check if the error is a 404 from the Django API and send an appropriate response
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'Recommended movies not found in the Django API.' })
        } else {
            // For other errors, send a 500 response with a generic error message
            res.status(500).json({ error: 'An error occurred while fetching recommended movies.' })
        }
    }
})

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
