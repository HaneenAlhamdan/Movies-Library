'use strict';
//console.log("test");
const pg    =require("pg");
const express = require("express");
const cors = require('cors');
const movie = require("./data.json");
const app = express();
app.use(cors());
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const port= process.env.port;
const key = process.env.APIKEY;

const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,

    ssl: { rejectUnauthorized: false }
});

 


function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.release_date = release_date;
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}


app.use(express.json());
app.get('/', homePageHandler);
app.get('/favorite', favoritePageHandler);
app.get('/trending', trendingPageHandler);
app.get('/search', searchPageHandler);
app.post('/addMovie', addMovieHandler);
app.get('/getMovies', getMoviesHandler);
app.put('/update/:id', updateHandler);
app.delete('/delete/:id', deleteHandler); 
app.get('/getMovie/:id', getMovieByIdHandler);
app.get("*", notFoundHandler);
app.use(errorHandler);

////////////////////////////////////////////////////////////////////


function homePageHandler(req, res) {
   
    let result = [];
    movie.data.forEach((value) => {
        let oneMovie = new Movie(value.id ||"N/A" ,value.title || "N/A", value.release_date || "N/A", value.poster_path || "N/A", value.overview || "N/A");
        result.push(oneMovie);

    });
    return res.status(200).json(result);

}
///////////////////////////////////////////////////////
function favoritePageHandler(req, res) {
    

    return res.status(200).send("Welcome to Favorite Page!!");
}
    //////////////////////////////////////////////////////////////


function trendingPageHandler(req, res) {
    let result = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${key}&language=en-US`)
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
////////////////////////////////////////////////////////////////////////////////

function searchPageHandler(req, res) {
    //This is PostMan link to query http://localhost:4000/search?Movie=Lord
    const search = req.query.Movie;
    let result = [];
    console.log(req);
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${search}&page=2`)
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

/////////////////////////////////////////////////////////////////////////////
function addMovieHandler(req, res) {
    const movieV = req.body;
    console.log(movieV);
    const sql = `INSERT INTO addmovie(release_date,title,poster_path,overview) VALUES($1,$2,$3,$4) RETURNING *;`;

    const values = [movieV.release_date, movieV.title, movieV.poster_path, movieV.overview];
    // const values = [, , ,  ];
    client.query(sql,values).then((result) => {
         return res.status(201).json(result.rows);
    }).catch(error => {
        errorHandler(error, req, res);
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////
function getMoviesHandler(req, res) {
    const sql = `SELECT * FROM addmovie;`;
    client.query(sql).then((result) => {
        res.status(201).json(result.rows);
    }).catch(error => {
        errorHandler(error, req, res);
    });
}
/////////////////////////////////////////////////////////////////////////////////////
function updateHandler(req, res) {
    const id = req.params.id;
    const movieUpdate = req.body;

    const sql = `UPDATE addmovie SET release_date=$1, title=$2 , poster_path=$3, overview=$4  WHERE id=$5 RETURNING *;`;
    const values = [movieUpdate.release_date, movieUpdate.title, movieUpdate.poster_path, movieUpdate.overview , id ];


    client.query(sql, values).then((result) => {
        return res.status(200).json(result.rows);
    }).catch((error) => {
        errorHandler(error, req, res);
    })
}
////////////////////////////////////////////////////////////////////////////////////////////////

function deleteHandler(req, res) {
    const id = req.params.id;
    const movieDel = req.body;

    const sql = `DELETE FROM addmovie WHERE id=$1 ;`;
    const value = [id];

    client.query(sql, value)
        .then((result) => {
            return res.status(204).json({});
        }).catch((error) => {
            errorHandler(error, req, res);
        })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
function getMovieByIdHandler(req, res) {
    const id = req.params.id;

    const sql = `SELECT * FROM addmovie WHERE id=$1 ;`;
    const value = [id];

    client.query(sql, value)
        .then((result) => {
            return res.status(200).json(result.rows);
        }).catch((error) => {
            errorHandler(error, req, res);
        })

}


///////////////////////////////////////////////////////////////////////////////////

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    return res.status(500).send(err);
}

function notFoundHandler(req, res) {
    return res.status(404).send("Not Found :404");

}

//////////////////////////////////////////////////////////////////////////////////////////

client.connect()
    .then(() => {
        app.listen(port, () => {
            console.log("Test :)");
        });
    }).catch(error => {
      console.log(error.message);
    });
                                                                
