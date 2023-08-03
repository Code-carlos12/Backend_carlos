const express = require('express')
const app = express();
const router = require("./router/router")
const handlebars = require("express-handlebars")
const { Server } = require('socket.io')
const mongoose = require("mongoose")

const ProductManager = require("./dao/remote/managers/product/productManager.js")
const productManager = new ProductManager();

const ChatManager = require("./dao/remote/managers/chat/chatManager.js")
const chatManager = new ChatManager();


const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/static", express.static("./src/public"));

const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});

app.engine("handlebars", hbs.engine)
app.set("views", "./src/views")
app.set("view engine", "handlebars")

router(app);  

const httpServer = app.listen(PORT, (req, res) => {
  console.log(`Server running at port: ${PORT}`)
});

mongoose.set("strictQuery", false)
const URL = "mongodb+srv://Carlos1:Diane1411@codecarlos1.6frwium.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(URL, {
  dbName: "ecommerce",
  userNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
  console.log("DB connected")
})
  .catch(e => {
  console.log("Can't connect to DB")
});

const io = new Server(httpServer)

io.on("connection", (socket) => {
  console.log(`New user ${socket.id} joined`)

  //recibe desde el front
  socket.on("client:newProduct", async (data) =>{
    const {title, description, price, code, stock, category} = data;

    const thumbnail = Array.isArray(data.thumbnail)
      ? data.thumbnail
      : [data.thumbnail];

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("All fields are required");
      }

      const product = {
        title,
        description,
        price: Number(price),
        thumbnail,
        code,
        stock: Number(stock),
        category,
      };

      await productManager.addProduct(product);

    //envia desde el back
    const products = await productManager.getProducts();
    const listProducts = products.filter((product) => product.status === true);

    io.emit("server:list", listProducts)
  });

  //recibe del front
  socket.on("cliente:deleteProduct", async (data) =>{
    const id = data;
    const logicalDeleteProduct = await productManager.logicalDeleteProduct(id);

    //envia desde el back
    const products = await productManager.getProducts()
    const listProducts = products.filter((product) => product.status === true)

    io.emit("server:list", listProducts)
  });

  socket.on("cliente:messsage", async (data) => {
    await chatManager.saveMessage(data);

    const messages = await chatManager.getMessage();
    io.emit("server:messages", messages)
  })

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`)
  })
});

