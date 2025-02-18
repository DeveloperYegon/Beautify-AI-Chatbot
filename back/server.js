const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
// const { GoogleVertexAIEmbeddings } = require("@langchain/embeddings/googlevertexai");
const {GoogleGenerativeAIEmbeddings}=require("@langchain/google-genai")

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

// Embedding & Vector Store Configuration
let vectorStore;
const initializeVectorStore = async (documents) => {
  const embeddings = new GoogleGenerativeAIEmbeddings();
  vectorStore = await Chroma.fromDocuments(documents, embeddings, {
    collectionName: "rag-collection",
  });
};

// Load and Index Website URL
app.post("/load-url", async (req, res) => {
  const { url } = req.body;
  try {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    await initializeVectorStore(docs);
    res.json({ message: "Website URL indexed successfully!" });
  } catch (error) {
    console.error("Error loading URL:", error);
    res.status(500).json({ error: "Failed to load URL" });
  }
});

// Load and Index PDF
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  const pdfPath = req.file.path;
  try {
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    await initializeVectorStore(docs);
    fs.unlinkSync(pdfPath); // Clean up uploaded file
    res.json({ message: "PDF indexed successfully!" });
  } catch (error) {
    console.error("Error loading PDF:", error);
    res.status(500).json({ error: "Failed to load PDF" });
  }
});

// Question Answering with RAG Pipeline
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  try {
    const relevantDocs = await vectorStore.similaritySearch(question, 3);
    const context = relevantDocs.map((doc) => doc.pageContent).join("\n");

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: question },
      { role: "context", content: context },
    ];

    const response = await llm.invoke(messages);

    if (!response || !response.content) {
      throw new Error("Invalid response from Gemini API");
    }

    res.json({ answer: response.content });
  } catch (error) {
    console.error("Error processing question:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
