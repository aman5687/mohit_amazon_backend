const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    token:{
        type: String,
        required:true,
    },
    number:{
        type: String,
        required: true,
        unique: true,
    },
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;