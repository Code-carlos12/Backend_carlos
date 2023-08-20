const express = require("express");
const app = express();
const router = require("./router/router.js");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const ProductManager = require("./dao/mongoManagers/productManager.js");
const productManager = new ProductManager();

const ChatManager = require("./dao/mongoManagers/chatManager.js")
const chatManager = new ChatManager()

const PORT = process.env.PORT || 8080;

app.use("/static", express.static("./src/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", "./src/views");
app.set("view engine", "handlebars");

router(app);

const httpServer = app.listen(PORT, (req, res) => {
  console.log(`Server running at port: ${PORT}`);
});

const URL =
  "mongodb+srv://Carlos1:Diane1411@codecarlos1.6frwium.mongodb.net/?retryWrites=true&w=majority";

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: URL,
      dbName: "ecommerce",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      ttl: 1000
    }),

    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


mongoose
  .connect(URL, {
    dbName: "ecommerce",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => {
    console.log("Can't connect to DB");
  });

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`New user ${socket.id} joined`);

  //Recibe del front
  socket.on("client:newProduct", async (data) => {
    const { title, description, price, code, stock, category } = data;

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

    //Envia el back
    const products = await productManager.getProducts();
    const listProducts = products.filter((product) => product.status === true);

    io.emit("server:list", listProducts);
  });

  //Recibe del front
  socket.on("client:deleteProduct", async (data) => {
    const id = data;

    const logicalDeleteProduct = await productManager.logicalDeleteProduct(id);

    //Envia el back
    const products = await productManager.getProducts();

    //Solo para mostrar los productos con status true
    const listProducts = products.filter((product) => product.status === true);

    io.emit("server:list", listProducts);
  });

  //Recibe del front
  socket.on("client:message", async (data) => {
    await chatManager.saveMessage(data)
    //Envia el back
    const messages = await chatManager.getMessages()
    io.emit("server:messages", messages)
  })

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});