// back/routes/chatroutes.js
const express = require('express');
const router = express.Router();
const { fetchAllChats ,fetchChatMessages,createChat,handleAsk} = require('../controllers/chatcontroller');
const { authMiddleware } = require("../middleware/authmiddleware");
const {validate,askSchema} = require('../middleware/validationMiddleware');
const {asyncHandler}=require('../utils/asyncHandler');



router.get('/user-chats', authMiddleware, fetchAllChats);
router.get('/chat-messages/:thread_id', authMiddleware,fetchChatMessages);
router.post('/start-chat', authMiddleware, createChat);
router.post('/ask', validate(askSchema),authMiddleware,handleAsk);
  

module.exports = router;
