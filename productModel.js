const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    quantity:{
        type: String,
        required: true,
    },
    picture:{
        type: String,
        required: true,
    },
    
},{collection: 'products'});

const Products = mongoose.model('Products', userSchema);

module.exports = Products;