const CartModel = require("./models/model.cart.js")

class CartManager{
    _getNextOrder = async () => {
        const count = await CartModel.count()
        const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;

        return nextId
    };

    createCart = async () => {
        try {
            const cart = {
                products: []
            };

            await CartModel.create(cart)
            return "Cart created successfully"
        } catch (error) {
            return console.log(error)
        }
    };

    getCarts = async () => {
        try {
            const carts = CartModel.find()
            return carts
        } catch (error) {
            console.log("Carts not found")
            return []
        }
    };

    getCartById = async (id) => {
        try {
            const cart = await CartModel.findById(id);

            if(!cart){
                return console.log(`Cart with id: ${id} does not exist`)
            }
        } catch (error) {
            return console.log(error)
        }
    };

    updateCart = async (id, arrayProducts) => {
        try {
            const validate = await CartModel.findByIdAndUpdate(id, {
                products: arrayProducts
            });

            if (!validate){
                return console.log(`Cart with id: ${id} does not exist`)
            }
            return true;
        } catch (error) {
            return console.log(error)
        }
    };

    deleteCart = async (Id) => {
        try {
            const cartDeleted = await CartModel.findByIdAndDelete(Id)

            if(!cartDeleted){
                return console.log("Cart does not exist")
            }
            return "Cart removed successfully"
        } catch (error) {
            return console.log(error)
        }
    };
}

module.exports = CartManager;