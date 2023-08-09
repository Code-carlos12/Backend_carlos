const { default: mongoose } = require("mongoose");
const ProductModel = require("./models/model.product.js");

class ProductManager{
    _getNextOrder = async () => {
        const count = await ProductModel.count();
        const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;

        return nextId; 
    };

    addProduct = async (product) => {
        try {
            const validate = await ProductModel.findOne({ code: product.code });
            if(!validate){
                product.status = true;
                await ProductModel.create(product);
                return "Product created successfully"
            } else{
                console.log(`The product with code: ${product.code} already exists`)
            }
        } catch (error) {
            return console.log(error)
        }
    };

    getProducts = async () => {
        try {
            const products = ProductModel.find();

            return products
        } catch (error) {
            console.log("Products not found");
            return [];
        }
    };

    getProductById = async (id) => {
        
        try {
          const products = await ProductModel.findById(id);
          
          return products;

        } catch (error) {
          return console.log(error)
        }
      };

    updateProduct = async (id, props) => {
        try {
            const validate = await ProductModel.findByIdAndUpdate(id, props);
            
            if(props.hasOwnProperty("id") || props.hasOwnProperty("code")){
              return  console.log("cannot update 'id' or 'code' property");
            }

            if(!validate){
                return console.log(`Product with id: ${id} does not exist`);
            }
            return true;
        } catch (error) {
            return console.log(error)
        }
    };

    deleteProduct = async (id) => {
        try {
           
            const productDeleted = await ProductModel.findByIdAndDelete(id);

            if(!productDeleted){
                return console.log("Product does not exist")
            }
            return "Product removed successfully";
        } catch (error) {
             console.error(error);
             return error;
        }
    };

    logicalDeleteProduct = async (id) => {
      try {
        
        const product = await ProductModel.findById(id);

        if(!product){
            return console.log("Product does not exist");
        }

        product.status  = false;

        await product.save();

        //return console.log("Product status updated successfully");
        return true;
      } catch (error) {
        throw error;
      }  
    };
}

module.exports = ProductManager;