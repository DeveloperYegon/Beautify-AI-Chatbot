const express = require('express');
const router = express.Router();
const { fetchAllChats ,fetchChatMessages,startChat, createChat} = require('../controllers/chatcontroller');
const { authMiddleware, adminMiddleware } = require("../middleware/authmiddleware");

router.get('/user-chats', authMiddleware, fetchAllChats);
router.get('/chat-messages/:thread_id', authMiddleware,fetchChatMessages);
router.post('/start-chat', authMiddleware, createChat);


module.exports = router;
