// controllers/chatController.js
const Chat = require("../models/Chat");
const { asyncHandler } = require('../utils/asyncHandler');
const ArticleService = require('../services/ArticleService');
const ProductService = require('../services/ProductService');
const RagService = require('../services/ragService');
const { v4: uuidv4 } = require("uuid");
const { getUserIdFromToken } = require("../middleware/authmiddleware");


module.exports = {
  handleAsk: asyncHandler(async (req, res) => {
    const { question, thread_id } = req.body;
    const userId = req.user.id;

    const validatedThreadId = thread_id || uuidv4();
    const aiResponse = await RagService.processQuestion(question, validatedThreadId);

    const [articles, productLink] = await Promise.all([
      ArticleService.fetchBeautyArticles(question),
      ProductService.generateProductRecommendation(question)
    ]);

    await Chat.findOneAndUpdate(
      { thread_id: validatedThreadId },
      {
        $set: { 
          user_id: userId,
          updated_at: new Date(), 
          latest_recommendations: { articles, productLink} 
        },
        $push: {
          messages: {
            $each: [
              { role: "user", content: question },
              { role: "ai", content: aiResponse,
                metadata: {
                  articles: articles.map(a => ({ title: a.title, url: a.link })),
                  productLink
                }
              }
            ]
          }
        }
      },
      { upsert: true, new: true,runValidators: true }
    );

    return res.json({ 
      answer: aiResponse,
      articles, productLink, 
      thread_id: validatedThreadId });
  }),

  fetchAllChats: asyncHandler(async (req, res) => {
    try {
              // Get user ID from auth token (you'll need to implement this)
        const userId = getUserIdFromToken(req.headers.authorization);
        
        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const chats = await Chat.find({ user_id: userId })
          .sort({ updated_at: -1 }) // Most recent first
          .select('thread_id updated_at'); // Only get these fields

        return res.json(chats);
    } catch (error) {
      console.error("Error fetching user chats:", error);
      return res.status(500).json({ error: "Failed to fetch chats" });
    }
  }),

  fetchChatMessages: asyncHandler(async (req, res) => {
    try {
      const { thread_id } = req.params;
      const userId = getUserIdFromToken(req.headers.authorization);
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const chat = await Chat.findOne({ 
        thread_id,
        user_id: userId 
      });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      return res.json(chat.messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return res.status(500).json({ error: "Failed to fetch messages" });
    }
  }),
   
  

  createChat: asyncHandler(async (req, res) => {
    const token = req.headers.authorization;
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const thread_id = uuidv4();
    await Chat.create({
      thread_id,
      user_id: userId,
      messages: [{
        role: "ai",
        content: "**Hello!** How can I help you today?"
      }],
      title: "New Chat"
    });

    res.json({ thread_id });
  } catch (error) {
    console.error("Error creating session:", error);
    return res.status(500).json({ error: "Failed to create session" });
  }
}),   

};