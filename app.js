const express = require('express')
require("dotenv").config();
const path = require('path');
const cors = require("cors");
const mongoose = require('mongoose');
const flash = require("connect-flash");
const session = require("express-session");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const app = express()
const port = 5000


dotenv.config({ path: "./.env" });


mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("Connected to the db"));


app.use(express.static('uploads'));

app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 }
    })
);
app.use(flash());

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory));

app.use('/', require('./routes/pages'))

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.status(200).send("logged out");
})

app.set("view engine", "hbs");

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
