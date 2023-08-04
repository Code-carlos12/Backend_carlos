const ChatManager = require("../../dao/mongoManagers/chatManager.js")
const chatManager =new ChatManager();
const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
    const messages = await chatManager.getMessages();
    const messagesReverse = messages.reverse();
    res.render("chat", { messages: messagesReverse })
});

module.exports = router;