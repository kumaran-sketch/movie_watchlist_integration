require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/*
CREATE DATABASE movie_app;

USE movie_app;

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    status ENUM('PENDING','WATCHED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

/*
POST /api/movies

{
  "title":"Interstellar",
  "genre":"Sci-Fi"
}
*/
app.post("/api/movies", async (req, res) => {
    try {
        const { title, genre } = req.body;

        if (!title || !genre) {
            return res.status(400).json({
                message: "Title and Genre are required"
            });
        }

        await db.execute(
            `INSERT INTO movies(title, genre)
             VALUES (?, ?)`,
            [title, genre]
        );

        res.status(201).json({
            message: "Movie Added Successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

/*
GET /api/movies
*/
app.get("/api/movies", async (req, res) => {
    try {
        const [movies] = await db.execute(
            `SELECT
                id,
                title,
                genre,
                status,
                created_at
             FROM movies
             ORDER BY id DESC`
        );

        res.status(200).json(movies);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
app.get("/api/sample-movies", (req, res) => {
    const movies = [
        {
            id: 1,
            title: "Interstellar",
            genre: "Sci-Fi",
            status: "WATCHED",
            created_at: "2026-08-20 10:15:30"
        },
        {
            id: 2,
            title: "Batman Begins",
            genre: "Action",
            status: "PENDING",
            created_at: "2026-08-21 14:30:15"
        },
        {
            id: 3,
            title: "Joker",
            genre: "Drama",
            status: "WATCHED",
            created_at: "2026-08-22 09:45:00"
        }
    ];
    console.log(movies,'movies')
    res.status(200).json(movies);
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});