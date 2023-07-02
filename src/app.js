const express = require('express')
const app = express();
const router = require("./router/router")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

router(app);

app.listen(8080, (req, res) => {
    console.log('Runing 8080')
});