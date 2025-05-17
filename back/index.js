// server.js
require("dotenv").config();
const cors = require("cors")
const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { initializeVectorStore } = require("./config/vectorstore");
const ragService = require("./services/ragService");
//const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// Database and Vector Store Initialization
async function initializeApp() {
  await connectDB();
  await initializeVectorStore();
  await ragService.initialize(); 
}

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", require("./routes/userRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/chats", require("./routes/chatRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

initializeApp().then(() => {
  app.listen(process.env.PORT || 5001, () => {
    console.log(`Server running on port ${process.env.PORT || 5001}`);
  });
});