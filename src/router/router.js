const productRouter = require("./routerFile/product.router.js");
const cartRouter = require("./routerFile/cart.router.js");
//const viewsControllerAsinc = require("./routerViews/productView/controller.views.js");
const viewsControllerSinc = require("./routerViews/productView/controller.viewsSinc.js");
const productsRouterMDB = require("./routerMDB/router.products.js")
const cartRouterMDB = require("./routerMDB/router.carts.js")
const chatRouter = require("./routerMDB/router.chat.js");
const sessionController = require("./session/controller.session.js");
const viewsControllerCart = require("./routerViews/cartView/controller.views.js")
const viewsControllerList = require("./routerViews/productView/controller.viewsList.js")
const viewsControllerSession = require("./routerViews/sessionView/controller.viewsSession.js");

const router = (app) =>{
    app.use("/api/mongo/products", productsRouterMDB)
    app.use("/api/products", productRouter)
    app.use("/api/carts", cartRouter)
    app.use("/api/mongo/carts", cartRouterMDB)
    app.use("/api/session", sessionController)
    
    app.use("/", viewsControllerSession);
    app.use("/productsList", viewsControllerList);
    app.use("/realTimeProducts", viewsControllerSinc)
    app.use("/chat", chatRouter)
    app.use("/cart", viewsControllerCart)
};

module.exports = router;