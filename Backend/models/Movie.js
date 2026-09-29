
const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({
    homepage: String,
    id: { type: Number, index: true },
    overview: String,
    release_date: Date,
    runtime: Number,
    tagline: String,
    title: String,
    // Phase 2A TMDB presentation/discovery enrichment fields
    poster_path: { type: String, default: null },
    backdrop_path: { type: String, default: null },
    genres: { type: [String], default: [] },
    vote_average: { type: Number, default: null },
    popularity: { type: Number, default: null },
});

// Phase 3 Discovery query optimization indexes
// 1. title: 1 - Optimizes case-insensitive title lookups and alphabetical sorting
// 2. popularity: -1 - Optimizes default catalog sorting by highest popularity
// 3. vote_average: -1 - Optimizes rating-based sorting and minimum rating threshold filtering
// 4. release_date: -1 - Optimizes chronological release date sorting and decade/year filtering
// 5. genres: 1 - Multi-key index for filtering movies by genre tags
movieSchema.index({ title: 1 });
movieSchema.index({ popularity: -1 });
movieSchema.index({ vote_average: -1 });
movieSchema.index({ release_date: -1 });
movieSchema.index({ genres: 1 });

const Movie = mongoose.model('Movie', movieSchema, 'movies');
module.exports = Movie;
