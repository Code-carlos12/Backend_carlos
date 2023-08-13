const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const productsCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: Array,
    code: {
        type: String,
        unique: true
    },
    stock: Number,
    category: String,
    status: Boolean
});

productSchema.plugin(mongoosePaginate);

mongoose.set("strictQuery", false);

const ProductModel = mongoose.model(productsCollection, productSchema);

module.exports = ProductModel;