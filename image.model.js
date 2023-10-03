const mongoose = require("mongoose");

const ImageSchema =  new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    price:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    quantity:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now(),
    },
});


module.exports = mongoose.model('Imagemodel', ImageSchema);