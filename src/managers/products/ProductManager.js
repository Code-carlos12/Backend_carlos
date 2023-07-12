const fs  = require('fs')


 class ProductManager{
    constructor(filename){
        this.filename = filename
        this.format = 'utf-8'
        this.products = []
    }

    getNexId = () => {
      const count = this.products.length;
      const nextId = count > 0 ? this.products[count -1].id + 1 :1

      return nextId;
    }

    addProduct = async(title, description, price, thumbnail, code, stock,category) =>{
        const products = await this.getProducts();

      try{
      const product = {
        id: this.getNexId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
        }

        if(products.find((product) => product.code === code)){
          return console.log(
            `El producto con código: ${product,code} ya existe\n`
          )
        }else{
        products.push(product)
        await fs.promises.writeFile(this.filename, JSON.stringify(products))
        
        return console.log(products)
      }
    }catch(error){
      return console.log(error)
    }
    }

    getProducts = async() =>{
        try{
            const data = await fs.promises.readFile(this.filename, this.format)
            const products = JSON.parse(data)
            this.products = products

            return products;
        } catch(error){
            console.log('No se encontro el archivo')
            return []
        }
    }

    getProductById= async(id) =>{
        const products = await this.getProducts()
        try{
          const itemId = Object.values(products).find((product) => product.id === id)
          if (itemId === undefined) {
            console.log('Producto no existe');
            return 'producto no existe';
          } else {
            console.log(itemId);
            return itemId;
          }
        }catch(error){
          return console.error(error)
        }
    }

    updateProduct = async(id, actualizarCamp) =>{
      const products = await this.getProducts();
      try {
        const index = await products.findIndex((product) => product.id === id);
  
        if (index === -1) {
          return console.log("El producto no existe");
        } else {
          if (
            actualizarCamp.hasOwnProperty("id") ||
            actualizarCamp.hasOwnProperty("code")
          ) {
            return console.log("No se puede actualizar la propiedad 'id' o 'code'");
          }
  
          Object.assign(products[index], actualizarCamp);
          await fs.promises.writeFile(this.filename, JSON.stringify(products))
          const updatedProduct = products[index];
  
          return console.log(updatedProduct);
        }
      } catch (error) {
        return console.error(error);
      }
    }

    deleteProduct = async(id) =>{
      let products = await this.getProducts();
      try {
        const product = Object.values(products).find((e) => e.id === id);
  
        if (product) {
          products = products.filter((item) => item.id !== id);
          await fs.promises.writeFile(this.filename, JSON.stringify(products))
  
          return console.log("Product removed");
        } else {
          return console.error("El producto no existe");
        }
      } catch (error) {
        return console.error(error);
      }
    }
}

module.exports = ProductManager;

