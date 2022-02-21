'use strict';

const express = require("express");
const movie = require("./Movie_Data/data.json");
const app = express();
function Movie(title,poster_path,overview) {
this.title=title;
this.poster_path=poster_path;
this.overview=overview;    
}
app.get('/',homePageHandler);
app.get('/favorite',favoritePageHandler);
function homePageHandler(req,res) {
    let result=[];
    movie.data.forEach((value)=>{
        let oneMovie=new Movie(value.title,value.poster_path,value.overview);
        result.push(oneMovie);

    });
   return res.status(200).json(result);
}
function favoritePageHandler(req,res) {

   return res.status(200).send("Welcome to Favorite Page");
}
app.listen(3000, () => {
console.log("Test :)");
});