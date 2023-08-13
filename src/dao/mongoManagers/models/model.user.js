const mongoose = require("mongoose");

const usersCollections = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: {
        type: String,
        unique: true
    },
    rol:{
        type: String,
        enum: [ "usuario", "admin"],
        default: "usuario",
    }

});

mongoose.set("strictQuery", false);

const UserModel = mongoose.model(usersCollections, userSchema)