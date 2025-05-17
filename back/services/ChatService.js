// services/chatService.js
const { v4: uuidv4 } = require('uuid');
const Chat = require('../models/Chat');

class ChatService {
  static async saveConversation(thread_id, userId, question, response) {
    const validatedThreadId = thread_id || uuidv4();
    
    return Chat.findOneAndUpdate(
      { thread_id: validatedThreadId },
      {
        $set: { user_id: userId, updated_at: new Date() },
        $push: { 
          messages: {
            $each: [
              { role: "user", content: question },
              { role: "ai", content: response }
            ]
          }
        }
      },
      { upsert: true, new: true }
    );
  }
}

module.exports = ChatService;