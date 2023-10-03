const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName:{
        type: String,
        required: true,
    },
    mobile:{
        type: String,
        required: true,
        unique: true,
    },
    token:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required: true,
    },
    totalPrice:{
        type: String,
        required: true,
    },
    currentAddress:{
        type: String,
        required: true,
    },
    permanentAddress:{
        type: String,
        required: true,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;