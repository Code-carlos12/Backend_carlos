const CartManager = require("../../../dao/mongoManagers/cartManager.js");
const cartManager = new CartManager();
const { Router} =  require("express");
const router = Router();

router.get("/:id", async (req, res) => {
    //modifivar el id
    const id = "64d2e74c7121e48a5941e943"
    const cart = await cartManager.getCartById(id)
    res.render("cart", cart);
  });
  
  module.exports = router;