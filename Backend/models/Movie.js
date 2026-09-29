
const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({
    homepage: String,
    id: Number,
    overview: String,
    release_date: Date,
    runtime: Number,
    tagline: String,
    title: String,
});

Movie = mongoose.model('Movie', movieSchema, 'movies');
module.exports = Movie
