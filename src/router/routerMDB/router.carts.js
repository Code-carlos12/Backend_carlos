const CartManager = require("../../dao/mongoManagers/cartManager.js");
const cartManager = new CartManager();
const ProductManager = require("../../dao/mongoManagers/productManager.js")
const productManager = new ProductManager();
const { Router } = require("express");
const router = Router();


router.get("/", async (req, res) => {
    try {
      const carts = await cartManager.getCarts();
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
    const cart = await cartManager.getCartById(cid);
    const product = await productManager.getProductById(pid)
    const productTitle = product.title;
    const validate = cart.products.find((el) => el._id === pid);
    
    if (!validate) {
      const newProduct = {
        _id: product._id,
        title: productTitle,
        quantity: quantity
      };

      cart.products.push(newProduct);
      let newCart = cart.products;

      const updatedCart = await cartManager.updateCart(cid, newCart);
      res.status(200).json("Nuevo producto agregado")
    } else {
      let newCart = cart.products;
      const productPosition = cart.products.findIndex((el) => el._id === pid);
      const updatedQuantity = newCart[productPosition].quantity = quantity;

      console.log(updatedQuantity);

      const updatedProduct = {
        _id: product._id,
        title: productTitle,
        quantity: updatedQuantity
      }
      console.log(updatedProduct);

      const updatedCart = await cartManager.updateCart(cid, newCart)
      console.log(updatedCart);
      res.status(200).json("Cantidad de producto actualizada")
    }
  } catch (err) {
    if (err.message.includes("Cart with id")) {
        res.status(404).json({ error404: err.message });
      }
  }
});


router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    let status = await cartManager.deleteCart(cid);

    res.status(200).json(`Se eliminó el carrito con id: ${cid}`);
  } catch (err) {
    if (err.message.includes("Cart does")) {
      res.status(404).json({ error400: err.message });
    }
  }
});

module.exports = router; 