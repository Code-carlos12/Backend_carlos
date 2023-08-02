const mongoose = require("mongoose")

const chatsCollection = "messages"

const chatSchema = new mongoose.Schema({
    user: String,
    message: String,
    hour: String
})

mongoose.set("strictQuery", false);

const ChatModel = mongoose.model(chatsCollection, chatSchema)

module.exports = ChatModel;