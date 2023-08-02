const fs = require("fs");

const path = "./Json/carrito.json";

class CartManager {
  static #path = "./Json/carrito.json";
  constructor() {
    this.carts = [];
    CartManager.#path;
  }

  _getNextId = () => {
    const count = this.carts.length;
    const nextId = count > 0 ? this.carts[count - 1].id + 1 : 1;

    return nextId;
  };

  createCart = async () => {
    const carts = await this.getCarts();

    try {
      const cart = {
        id: this._getNextId(),
        products: [],
      };

      carts.push(cart);
      await fs.promises.writeFile(
        CartManager.#path,
        JSON.stringify(carts, null, "\t")
      );
      return carts;
    } catch (err) {
      return console.log(err);
    }
  };

  getCarts = async () => {
    try {
      const data = await fs.promises.readFile(CartManager.#path, "utf-8");
      const carts = JSON.parse(data);
      this.carts = carts;
      return carts;
    } catch {
      console.log("archivo no encontrado");
      return [];
    }
  };

  getCartById = async (idCart) => {
    const carts = await this.getCarts();
    try {
      const cartId = Object.values(carts).find((cart) => cart.id === idCart);

      if (cartId === undefined) {
        console.error("no existe el carrito");
        return "no existe el carrito";
      } else {
        console.log(cartId);
        return cartId;
      }
    } catch (err) {
      throw err;
    }
  };

  updateCart = async (idCart, idProduct, quantity = 1) => {
    const carts = await this.getCarts();
    try {
      const cart = await carts.find((cart) => cart.id === idCart);
      if (cart === undefined) {
        return console.log(`El carrito con el id: ${idCart} no existe`);
      }

      if (!cart.products) {
        cart.products = [];
        return console.log(`El carrito no tiene productos`);
      }

      const productExist = cart.products.find(
        (product) => product.id === idProduct
      );
      if (productExist) {
        productExist.quantity += quantity;
      } else {
        cart.products.push({
          id: idProduct,
          quantity,
        });
      }

      await fs.promises.writeFile(
        CartManager.#path,
        JSON.stringify(carts, null, "\t")
      );
      return cart;
    } catch (err) {
      throw err;
    }
  };

  deleteCart = async (idCart) => {
    let carts = await this.getCarts();
    try {
      const cart = Object.values(carts).find((cart) => cart.id === idCart);
      if (cart) {
        carts = carts.filter((item) => item.id !== idCart);
        await fs.promises.writeFile(path, JSON.stringify(carts), "utf-8");

        return console.log("Cart removed");
      } else {
        return console.error("no existe el carrito");
      }
    } catch (err) {
      throw error;
    }
  };
}

module.exports = CartManager;

