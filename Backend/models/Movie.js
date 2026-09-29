
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

const Movie = mongoose.model('Movie', movieSchema, 'movies');
module.exports = Movie;
