const productRouter = require("../managers/products/product.router");
const cartRouter = require("../managers/cart/cart.router");

const router = (app) =>{
    app.use("/api/products", productRouter)
    app.use("/api/carts", cartRouter)
};

module.exports = router;