const express = require('express')
const path = require('path');
const cors = require("cors");
const mongoose = require('mongoose');
const flash = require("connect-flash");
const session = require("express-session");
const dotenv = require("dotenv");
const {v4: uuidv4} = require("uuid");

// const path = require("path");


const app = express()
const port = 5000

dotenv.config({path: "./.env"});



app.use(express.static('uploads'));

app.set("view engine", "hbs");

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: true,
        saveUninitialized: true,
        cookie:{maxAge: 24*60*60*1000}
    })
);
app.use(flash());

// multer configuration starts





// multer configuration ends

app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.post("/logout", (req, res)=>{
    req.session.destroy();
    res.status(200).send("logged out");
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));