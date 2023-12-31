const mongoose = require("mongoose")

const cartsCollection = "cart"


const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            }
        ],
        default: []
    }
});

cartSchema.pre("find", function () {
    this.populate("products.product")
});

cartSchema.pre("findOne", function () {
    this.populate("products.product")
});

const CartModel = mongoose.model(cartsCollection, cartSchema);

module.exports = CartModel;