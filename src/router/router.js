const productRouter = require("../managers/products/product.router.js");
const cartRouter = require("../managers/cart/cart.router.js");
const viewsControllerAsinc = require("../managers/views/controller.views.js");
const viewsControllerSinc = require("../managers/views/controller.viewsSinc.js");
const productsRemoteController = require("../managers/remote/router.products.js")
const cartRemoteController = require("../managers/remote/router.carts.js")
const chatController = require("../managers/views/chat/router.chat.js");


const router = (app) =>{
    app.use("/api/remote/products", productsRemoteController)
    app.use("/api/products", productRouter)
    app.use("/api/carts", cartRouter)
    app.use("/api/remote/carts", cartRemoteController)
    app.use("/", viewsControllerAsinc);
    app.use("/realTimeProducts", viewsControllerSinc)
    app.use("/chat", chatController)
};

module.exports = router;
