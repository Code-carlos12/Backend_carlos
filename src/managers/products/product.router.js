const ProductManager = require("./ProductManager");
const {Router} = require("express");

//me guesta poner la ruta de json, la rura es ese, pero no se porque no me encuentra el archivo :( 
const productManager = new ProductManager();
const router = Router();

router.get("/", async ( req, res) => {
  const { limit } = req.query;
  try {
    const products = await productManager.getProducts();
    if (!limit || limit < 1) {
      res.status(200).json(products);
    } else {
      const limitedProducts = products.slice(0, limit);
      res.status(200).json(limitedProducts);
    }
  } catch (err) {
    res.status(500).json({ error500: "error de servidor" });
  }
})

router.get("/:pid", async (req, res) => {
    let { pid } = req.params;
  
    try {
      //la busqueda de un producto
      const product = await productManager.getProductById(Number(pid));
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error500: "error de servidor" });
    }
});

router.post("/", async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    const thumbnail = req.body.thumbnail || [];
  
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error400: "Todos los campos son obligatorios" });
    }
  
    try {
      const products = await productManager.getProducts();
      if (products.find((product) => product.code === code)) {
        res
          .status(409)
          .json({ error409: `El producto con el codigo: ${code} ya existe` });
      } else {
        await productManager.addProduct(
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category
        );
        res.status(200).json("El producto fue creado con éxito");
      }
    } catch (err) {
      res.status(500).json({ error500: "error de servidor" });
    }
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const props = req.body;
    try {
      const updatedProduct = await productManager.updateProduct(
        Number(pid),
        props
      );
      if (!updatedProduct) {
        res.status(404).json({ error404: `El producto con el id: ${pid} no existe.` });
      } else {
        res.status(200).json(updatedProduct);
      }
    } catch (err) {
      res.status(500).json({ error500: "solicitud incorrecta" });
    }
});
  
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.deleteProduct(Number(pid));
    if (!product) {
      res.status(404).json({ error404: `El producto con el id: ${pid} no existe` });
    } else {
      res.status(200).json(`El producto con el id: ${pid} ha sido eliminado correctamente`);
    }
  } catch (err) {
    res.status(500).json({ error500: "Error de servidor" });
  }
});




module.exports = router;