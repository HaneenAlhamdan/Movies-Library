DROP TABLE  addmovie;

CREATE TABLE addmovie(
id SERIAL PRIMARY KEY,
release_date INTEGER,
title VARCHAR(1000),
poster_path VARCHAR(1000),
overview VARCHAR(10000)
);