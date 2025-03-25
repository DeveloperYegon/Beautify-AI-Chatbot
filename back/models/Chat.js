const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    required: true, 
    enum: ["user", "ai", "system"] // Added 'system' for admin/bot messages
  },
  content: { 
    type: String,
    required: true,
    validate: {
      validator: v => v.trim().length > 0,
      message: "Message cannot be empty"
    }
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true // For faster sorting
  },
  // Added metadata for AI responses
  metadata: {
    sources: [{
      type: {
        type: String,
        enum: ["url", "pdf", "vector_store"]
      },
      reference: String
    }],
    response_quality: {
      type: Number,
      min: 1,
      max: 5
    }
  }
}, { _id: false }); // Prevent automatic _id for messages

const chatSchema = new mongoose.Schema({
  thread_id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true // Faster user-based queries
  },
  messages: [messageSchema],
  title: { // Added for better chat identification
    type: String,
    default: "New Chat", // Simple default first
    trim: true
  },
  created_at: { 
    type: Date, 
    default: Date.now,
    immutable: true // Prevent modification
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  },
  status: { // Added chat state management
    type: String,
    enum: ["active", "archived", "pinned"],
    default: "active"
  },
  tags: { // Moved tags out of metadata for easier querying
    type: [String],
    index: true
  }
});

// Auto-update timestamp on save
chatSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  
  // Only auto-generate title if not set and messages exist
  if ((!this.title || this.title === 'New Chat') && 
      this.messages && this.messages.length > 0) {
    const firstUserMessage = this.messages.find(m => m.role === 'user');
    this.title = firstUserMessage?.content.substring(0, 30) + '...' || 'New Chat';
  }
  
  next();
});

// Add text index for search
chatSchema.index({
  'messages.content': 'text',
  title: 'text'
}, {
  weights: {
    title: 10, // Boost title matches
    'messages.content': 5
  }
});

module.exports = mongoose.model("Chat", chatSchema);