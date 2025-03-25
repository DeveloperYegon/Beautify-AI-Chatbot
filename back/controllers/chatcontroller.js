const Chat = require("../models/Chat");
const { getUserIdFromToken } = require("../middleware/authmiddleware");

//fetch all chats
module.exports.fetchAllChats = async (req, res) => {
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
};

module.exports.fetchChatMessages=async(req,res)=>{
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
  }}


