const ProductManager = require("../products/ProductManager.js");
const productManager = new ProductManager();
const { Router } = require("express");
const router = Router();

router.post("/form", async (req, res) => {
  const { title, description, price, code, stock, category } = req.body;
  const thumbnail = Array.isArray(req.body.thumbnail)
    ? req.body.thumbnail
    : [req.body.thumbnail];

  if (!title || !description || !price || !code || !stock || !category) {
    return res.status(400).json({ error400: "All fields are required" });
  }

  try {
    await productManager.addProduct(
      title,
      description,
      Number(price),
      thumbnail,
      code,
      Number(stock),
      category
    );
    res.redirect("/");
  } catch (error) {
    if (error.message.includes("The product with")) {
      res.status(409).json({ error409: error.message });
    }
  }
});

router.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await productManager.getProducts();
    if (!limit || limit < 1) {
      res.render("home", {
        products: products,
      });
    } else {
      const limitedProducts = products.slice(0, limit);
      res.render("home", {
        products: limitedProducts,
      });
    }
  } catch (error) {
    res.status(400).json({ error400: "Bad Request" });
  }
});

router.get("/form", (req, res) => {
  res.render("form", {});
});

module.exports = router;