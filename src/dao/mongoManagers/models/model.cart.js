const mongoose = require("mongoose")

const cartsCollection = "cart"

const productSchema = new mongoose.Schema({
    _id: String,
    title: String,
    quantity: Number
});

const cartSchema = new mongoose.Schema({
    products: [productSchema]
});

const CartModel = mongoose.model(cartsCollection, cartSchema);

module.exports = CartModel;