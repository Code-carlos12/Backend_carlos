const ChatModel = require("./models/model.message.js")

class ChatManager {
    saveMessage = async (message) => {
        try {
            const newMessage = await ChatModel.create(message)

            return "Message saved"
        } catch (error) {
            return console.log(error)
        }
    };

    getMessages = async () => {
        try {
            const messages = await ChatModel.find()

            return messages
        } catch (error) {
            console.log("No messages")
            
            return [];
        }
    };
}

module.exports = ChatManager;