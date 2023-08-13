const CartManager = require("../../dao/mongoManagers/cartManager.js");
const cartManager = new CartManager();
const ProductManager = require("../../dao/mongoManagers/productManager.js")
const productManager = new ProductManager();
const { Router } = require("express");
const router = Router();


router.get("/", async (req, res) => {
    try {
      const carts = await cartManager.getCarts();
      console.log(carts);
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json({ error500: "error de servidor" });
    }
});


router.get("/:cid", async (req, res) => {
    let { cid } = req.params;
  
    try {
      const cart = await cartManager.getCartById(cid);
      res.status(200).json(cart);
    } catch (err) {
        if (err.message.includes("Cart with id")) {
            res.status(404).json({ error404: err.message });
        }
    }
});


router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(200).json("Se creó un nuevo carrito.");
  } catch (err) {
    res.status(500).json({ error500: "error de servidor" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  try {
    const updatedCar = await cartManager.updateCart(cid, pid, quantity);
    res.status(200).json("Producto agragado al carrito")
  } catch (err) {
    if (err.message.includes("Cart with id")) {
        res.status(404).json({ error404: err.message });
      }
  }
});


router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    let status = await cartManager.deleteProducts(cid);

    res.status(200).json(`Se eliminó el carrito con id: ${cid}`);
  } catch (err) {
    if (err.message.includes("Cart does")) {
      res.status(404).json({ error400: err.message });
    }
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid} = req.params
  try {
    const status = await cartManager.deleteProduct(cid, pid);
    res.status(200).json(`Se elimino el producto con el id: ${pid}`)
  } catch (err) {
    if (err.message.includes("Cart with")) {
      res.status(404).json({ error400: err.message });
    }
    if (err.message.includes("Product with")) {
      res.status(404).json({ error400: err.message });
    }
  }
})

module.exports = router; 