const CartModel = require("./models/model.cart.js")

class CartManager{
    _getNextOrder = async () => {
        const count = await CartModel.count()
        const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;

        return nextId
    };

    createCart = async () => {
        try {
            const oneCart = await CartModel.create(cart)

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

            if(cart === null){
                return console.log(`Cart with id: ${id} does not exist`)
            }
            return cart
        } catch (error) {
            return console.log(error)
        }
    };

    updateCart = async (idCart, idProduct, quantity) => {
        try {
            const cart = await CartModel.findById(idCart);

            if(cart === null){
                return console.log(`Cart with id: ${idCart} does not existe`);
            }

            if(cart.products.length === 0){
                cart.products.push({ product: idProduct, quantity: quantity })
            }

            const productPosition = cart.products.findIndex((el) => el.product._id == idProduct);

            if(productPosition !== -1){
                cart.products[productPosition].quantity += quantity;
            } else {
                cart.products.push({ product: idProduct, quantity: quantity })
            }

            const newCart = await CartModel.findByIdAndUpdate(idCart, cart)

            return true;
        } catch (error) {
            return console.log(error)
        }
    };

    deleteCart = async (Id) => {
        try {
            const cartDeleted = await CartModel.findByIdAndDelete(Id)

            if(cartDeleted === null){
                return console.log("Cart does not exist")
            }
            return "Cart removed successfully"
        } catch (error) {
            return console.log(error)
        }
    };

    deleteProduct = async (idCart, idProduct) => {
        try {
           const cart = await CartModel.findById(idCart)
           
           if(cart === null){
            return console.log(`Cart with id: ${idCart} does not existe`);
           }

           const productPosition = cart.products.findIndex((el) => el.product._id == idProduct);
           if(productPosition === -1){
            return console.log(`Product with id: ${idProduct} does not exist`)
           } 

           cart.products.slice(productPosition, 1);

           let newCart = cart.products
           
           const productDelete = await CartModel.findByIdAndUpdate(idCart, {
            products: newCart
           });

           return "Product removed successfully";
        } catch (error) {
            return console.log(error)
        }
    };


    deleteProducts = async (idCart) => {
        try {
           const cart = await CartModel.findById(idCart)
           
           if(cart === null){
            return console.log(`Cart does not existe`);
           }

           cart.products.slice(0);

           let newCart = cart.products
           
           const productDelete = await CartModel.findByIdAndUpdate(idCart, {
            products: newCart
           });

           return "Cart removed successfully";
        } catch (error) {
            return console.log(error)
        }
    };
    
}

module.exports = CartManager;