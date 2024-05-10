const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const origin = ["https://gymbro.lafarandoleparis.com", "http://gymbro.lafarandoleparis.com"];
app.use(cors({ origin }));


const workoutRoute = require('./routes/workouts');
app.use('/workouts', workoutRoute);

const userRoute = require('./routes/users');
app.use('/users', userRoute);

app.use('/', (req, res) => {
    res.status(200).json({ message: "Welcome to moh's gym bro backend." })
});

// app.use(express.static(path.join(__dirname, '../build')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build'))
// });

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to mongoDb successfully ');
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`)
        });
    })
    .catch((err) => {
        console.log(err);
    })
