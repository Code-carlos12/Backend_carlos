const CartManager = require("./cartManager");
const cartManager = new CartManager();
const { Router } = require("express");
const router = Router();


router.get("/", async (req, res) => {
    try {
      const carts = await cartManager.getCarts();
      res.status(200).json(carts);
    } catch (err) {
      res.status(400).json({ error400: "solicitud incorrecta" });
    }
});


router.get("/:cid", async (req, res) => {
    let { cid } = req.params;
  
    try {
      const cart = await cartManager.getCartById(Number(cid));
      res.status(200).json(cart);
    } catch (err) {
      res.status(404).json({ error404: "no encontrado" });
    }
});


router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(200).json("Se creó un nuevo carrito.");
  } catch (err) {
    res.status(400).json({ error400: "Error al crear el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  try {
    const update = await cartManager.updateCart(
      Number(cid),
      Number(pid),
      quantity
    );
    if (update) {
      res
        .status(200)
        .json(`El producto ${pid} en el carrito ${cid} se actualizó con éxito`);
    } else {
      res.status(404).json({ error404: "no encontrado" });
    }
  } catch (err) {
    res.status(400).json({ error400: "solicitud incorrecta" });
  }
});


router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    await cartManager.deleteCart(Number(cid));
    res.status(200).json(`Se eliminó el carrito con el id: ${cid}`);
  } catch (err) {
    res.status(400).json({ error400: "solicitud incorrecta" });
  }
});

module.exports = router;