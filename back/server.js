const express = require("express");
const app = express();
const port = 5001;
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const Chat = require("./models/Chat");
const {getUserIdFromToken}=require("./middleware/authmiddleware");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
 const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
 const { MongoDBAtlasVectorSearch} =require("@langchain/mongodb") ;
 const { MongoClient} =require("mongodb");
 const {START, END, MessagesAnnotation, StateGraph,MemorySaver}= require("@langchain/langgraph");
const {v4:uuidv4}= require("uuid");



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

const client = new MongoClient(process.env.MONGO_URI || "");
const collection = client
  .db(process.env.MONGODB_ATLAS_DB_NAME)
  .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME);


// Middleware
app.use(cors());
app.use(bodyParser.json());
const upload = multer({ dest: "uploads/" });



// LangChain LLM
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-flash",
  temperature: 0,
  streaming: true,
});
// Initialize MemorySaver for conversation history
const memory = new MemorySaver();
// Define the workflow for RAG + LLM
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("retrieve", async (state) => {
    try {
      const {  messages } = state;
      const question = messages[messages.length - 1].content;
      console.log("Input to retrieve node:", question); // Debugging
      const relevantDocs = await vectorStore.similaritySearch(question, 3);
     // console.log(" Retrieved Docs:", relevantDocs);
      const context = relevantDocs.map((doc) => doc.pageContent).join("\n");
      return { messages, context };
    } catch (error) {
      console.error("Error in retrieve node:", error);
      throw new Error("Failed to retrieve relevant documents.");
    }
  })
  .addNode("generate", async (state) => {
    try{
    const { messages, context } = state;
    const promptMessage = `Here is relevant background information:\n${context}\n\nUser's Question: ${messages[messages.length - 1].content}`;

    const response = await llm.invoke([
      { role: "system", content: "You are a beauty expert trained by Tilt Technologies. Only answer questions related to skincare, cosmetics, and beauty. If the question is unrelated, politely refuse to answer." },
      ...messages,
      { role: "user", content: promptMessage },
    ]);

    const aiResponse = response.content;
    return { messages: [...messages, { role: "ai", content: aiResponse }] };
  } catch (error) {
    console.error("Error in generate node:", error);
      throw new Error("Failed to generate response.");
    }
  })
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", END);

// Compile the workflow with MemorySaver
const appWorkflow = workflow.compile({ checkpointer: memory });

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,

});
// Embedding & Vector Store Configuration
let isVectorStoreInitialized = false;
let vectorStore = null;

const initializeVectorStore = async (documents = []) => {
  try {
    if (vectorStore) {
      console.log("Vector store already initialized. Skipping reinitialization.");
    } else {
      console.log("Initializing Vector Store...");

      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
      });

      console.log("Embedding model initialized with API key:", process.env.GEMINI_API_KEY ? "✅" : "❌");

      vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
        collection: collection,
        indexName: "lorealrag", // The name of the Atlas search index
        textKey: "text", // The name of the collection field containing the raw content
        embeddingKey: "embedding", // The name of the collection field containing the embedded text
      });

      isVectorStoreInitialized = true;
      console.log("Vector store initialized with collection:", process.env.MONGODB_ATLAS_COLLECTION_NAME);
    }

    // Add documents to the vector store if provided
    if (documents.length > 0) {
      console.log("Adding documents to vector store...");
      //console.log("Sample document to add:", JSON.stringify(documents[0], null, 2)); // Log the first document
      await vectorStore.addDocuments(documents);
      console.log("Documents added to vector store.");
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      // Log the number of documents in the collection
      const count = await collection.countDocuments();
      console.log("Total documents in collection:", count);
    }
  } catch (error) {
    console.error("Error initializing vector store:", error);
    isVectorStoreInitialized = false;
  }
};
//  Initialize Vector Store When Server Starts
(async () => {
  await initializeVectorStore(); // Start with an empty document list
})();




//fetch articles
const fetchBeautyArticles = async (query) => {

  try {
    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey) {
      console.error("SerpAPI key is missing! Check your .env file.");
      return [];
    }
    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query + " beauty skincare")}+site:vogue.com&api_key=${apiKey}`;

    const response = await axios.get(searchUrl);

    if (!response.data.organic_results || response.data.organic_results.length === 0) {
      console.error(" No articles found.");
      return [];
    }
    const articles = response.data.organic_results.slice(0, 3).map((result) => ({
      title: result.title,
      link: result.link,
    }));

    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

//get product recommendation
const generateProductRecommendation = (query) => {
  // Map question keywords to beauty categories
  const productMapping = {
    "acne": "face-wash",
    "moisturizer": "moisturizer",
    "dark spots": "brightening-cream",
    "wrinkles": "anti-aging",
    "dry skin": "hydrating-serum",
  };

  let searchTerm = "skincare";
  Object.keys(productMapping).forEach((keyword) => {
    if (query.toLowerCase().includes(keyword)) {
      searchTerm = productMapping[keyword];
    }
  });

  return `https://www.garnier.fr/skin-coach?search=${encodeURIComponent(searchTerm)}`;
};



// Load and Index Website URL

  app.post("/load-url", async (req, res) => {
    const { url } = req.body;
    console.log("URL:", url);
    try {
      console.time("Loading URL content");
      const loader = new CheerioWebBaseLoader(url);
      const docs = await loader.load();
      console.timeEnd("Loading URL content");
      console.log("Number of documents loaded:", docs.length);
     // console.log("Sample document:", JSON.stringify(docs[0], null, 2)); // Log the first document

      if (docs.length === 0) {
        console.error("No documents loaded from URL.");
        return res.status(400).json({ error: "No content found at the provided URL." });
      }

      console.time("Adding metadata");

      // Add metadata (e.g., URL) to each document
      const docsWithMetadata = docs.map((doc) => ({
        ...doc,
        zmetadata: { ...doc.metadata, url },
      }));
      console.timeEnd("Adding metadata");

      console.log(`"data"${docsWithMetadata}`);

      await initializeVectorStore(docsWithMetadata);
      console.log("Website URL indexed successfully!");

      // Log the number of documents added
          const count = await collection.countDocuments({
            "metadata.source": url,
            "metadata.url": url
          });
      console.log(`Number of documents indexed for ${url}:`, count);

      return res.json({ message: "Website URL indexed successfully!" });
    } catch (error) {
      console.error("Error loading URL:", error);
      return res.status(500).json({ error: "Failed to load URL" });
    }
  });


// Load and Index PDF
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  const pdfPath = req.file.path;
  const originalName = req.file.originalname; // Original file name
  console.log("PDF Path:", pdfPath);

  try {
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();


     // Add metadata (e.g., PDF path and original name) to each document
     const docsWithMetadata = docs.map((doc) => ({
      ...doc,
      metadata: { ...doc.metadata, pdfPath, originalName },
    }));


    await initializeVectorStore(docsWithMetadata);
    fs.unlinkSync(pdfPath); // Clean up uploaded file
    console.log("PDF indexed successfully!");

      // Log the number of documents added
      const count = await collection.countDocuments({ "metadata.pdfPath": pdfPath });
      console.log(`Number of documents indexed for ${originalName}:`, count);

    return res.json({ message: "PDF indexed successfully!" });
  } catch (error) {
    console.error("Error loading PDF:", error);
    return res.status(500).json({ error: "Failed to load PDF" });
  }
});
app.post("/ask", async (req, res) => {
  const { question, thread_id } = req.body;
  console.log(req.body);

  // Extract user ID from Authorization header
  const token = req.headers.authorization;
  const userId = getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Invalid question format." });
  }

  if (!isVectorStoreInitialized) {
    return res.status(500).json({ error: "Vector store is not initialized." });
  }

  try {
    // Validate thread_id
    const validatedThreadId = thread_id && typeof thread_id === "string" && thread_id.trim().length > 0
    ? thread_id
    : uuidv4();
console.log("Validated Thread ID:", validatedThreadId);  

    // Retrieve or initialize conversation history
    const config = { configurable: { thread_id: validatedThreadId } };
    const initialState = { messages: [{ role: "user", content: question }] };

    // Invoke AI Workflow
    const output = await appWorkflow.invoke(initialState, config);
    console.log("AI Workflow Output:", output);

    // Extract AI response
    const aiResponse = output.messages[output.messages.length - 1].content;

    // Fetch external resources
    const articles = await fetchBeautyArticles(question);
    const productLink = generateProductRecommendation(question);

    // Save the chat in MongoDB
    const chat = await Chat.findOneAndUpdate(
      { thread_id: validatedThreadId },
      {
        $set: {
          user_id: userId,
          updated_at: new Date(),
          title: `Chat about ${question.substring(0, 20)}...`, // Title update
        },
        $push: {
          messages: {
            $each: [
              { role: "user", content: question },
              { role: "ai", content: aiResponse }
            ]
          }
        }
      },
      { upsert: true, new: true }
    );
    
    // If chat was just created, ensure messages field exists
    if (!chat.messages) {
      await Chat.updateOne(
        { thread_id: validatedThreadId },
        { $set: { messages: [] } }
      );
    }

    console.log("Chat saved to MongoDB:", chat);

    return res.json({
      answer: aiResponse,
      articles,
      productLink,
      thread_id: validatedThreadId, 
    });

  } catch (error) {
    console.error("Error processing question:", error);
    return res.status(500).json({ error: "Failed to process the request" });
  }
});
app.get("/fetch-all", async (req, res) => {

 try {
      // Fetch all documents from the vector store
      const allDocs = await vectorStore.similaritySearch("", 1000); // Adjust limit as needed
  
      if (allDocs.length === 0) {
        return res.status(404).json({ message: "No indexed documents found." });
      }
  
      // Extract and return the documents
      const indexedDocs = allDocs.map((doc) => ({
        content: doc.pageContent,
        metadata: doc.metadata, // Includes URL, PDF path, etc.
      }));
      return res.json({ indexedDocs });
    } catch (error) {
      console.error("Error fetching indexed documents:", error);
      return res.status(500).json({ error: "Failed to fetch indexed documents" });
    }
  });

// clean up old conversation histories
const cleanupOldSessions = async () => {
  try {
    const cutoffTime = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
    await memory.deleteOlderThan(cutoffTime);
    console.log("Cleaned up old sessions.");
  } catch (error) {
    console.error("Error cleaning up old sessions:", error);
  }
};


// Run cleanup every 24 hours
setInterval(cleanupOldSessions, 24 * 60 * 60 * 1000);
// Routes
app.use('/api', require('./routes/userroutes'));
app.use('/chats', require('./routes/chatroutes'));
// app.use('/auth', require('./routes/authroutes'));
app.use("/resources", require("./routes/resourceroutes"));


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
