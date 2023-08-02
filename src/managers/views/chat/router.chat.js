const ChatManager = require("../../../dao/remote/managers/chat/chatManager.js")
const chatManager =new ChatManager();
const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
    const messages = await chatManager.getMessage();
    const messagesReverse = messages.reverse();
    res.render("chat", { messages: messagesReverse })
});

module.exports = router;