'use strict';
//console.log("test");

const express = require("express");
const cors = require('cors');
const movie = require("./data.json");
const app = express();
app.use(cors());
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const APIKEY = "4a19a377a6dba141e32aa68fb5f3fe00";
function Movie(title, genre_ids, original_language, original_title, poster_path, video, vote_average, overview, release_date, vote_count, id, adult, backdrop_path, popularity, media_type) {
    this.title = title;
    this.genre_ids = genre_ids;
    this.original_language = original_language;
    this.original_title = original_title;
    this.poster_path = poster_path;
    this.video = video;
    this.vote_average = vote_average;
    this.overview = overview;
    this.release_date = release_date;
    this.vote_count = vote_count;
    this.id = id;
    this.adult = adult;
    this.backdrop_path = backdrop_path;
    this.popularity = popularity;
    this.media_type = media_type;
}
app.get('/', homePageHandler);
app.get('/favorite', favoritePageHandler);
app.get('/trending', trendingPageHandler);
app.get('/search', searchPageHandler);
app.use(errorHandler);
function homePageHandler(req, res) {
    let result = [];
    movie.data.forEach((value) => {
        let oneMovie = new Movie(value.title || "N/A", value.poster_path || "N/A", value.overview || "N/A");
        result.push(oneMovie);

    });
    return res.status(200).json(result);
}
function favoritePageHandler(req, res) {

    return res.status(200).send("Welcome to Favorite Page!!");
}
function trendingPageHandler(req, res) {
    let result = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
        .then(apiResponse => {
            console.log(apiResponse);
            apiResponse.data.results.map(value => {
                let oneMovie = new Movie(value.id || "N/A", value.title || "N/A", value.release_date || "N/A", value.poster_path || "N/A", value.overview || "N/A");
                result.push(oneMovie);
            });
            return res.status(200).json(result);
        }).catch(error => {
            errorHandler(error, req, res);
        });
}
function searchPageHandler(req, res) {
    //This is PostMan link to query http://localhost:4000/search?Movie=Lord
    const search = req.query.Movie;
    let result = [];
    console.log(req);
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${search}&page=2`)
        .then(apiResponse => {
            apiResponse.data.results.map(value => {
                let oneMovie = new Movie(value.id || "N/A", value.title || "N/A", value.release_date || "N/A", value.poster_path || "N/A", value.overview || "N/A");
                result.push(oneMovie);
            });
            return res.status(200).json(result);
        }).catch(error => {
            errorHandler(error, req, res);
        });
}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    return res.status(500).send(err);
}

app.listen(4000, () => {
    console.log("Test :)");
});

