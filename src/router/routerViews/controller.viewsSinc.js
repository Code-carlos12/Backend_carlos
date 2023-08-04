const ProductManager = require("../../dao/mongoManagers/productManager.js");
const productManager = new ProductManager();
const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products: products });
});

module.exports = router;