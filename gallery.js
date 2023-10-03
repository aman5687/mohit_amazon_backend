const mongoose = require("mongoose");

const gallerySchema =  new mongoose.Schema({
    video:{
        type: String,
    },
    token:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now(),
    },
});


module.exports = mongoose.model('gallery', gallerySchema);