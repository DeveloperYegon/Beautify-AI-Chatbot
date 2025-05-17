// config/vectorstore.js
const { MongoClient } = require("mongodb");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");

let vectorStore = null;

exports.initializeVectorStore = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    const collection = client
      .db(process.env.MONGODB_ATLAS_DB_NAME)
      .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
    });

    vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection:collection,
      indexName: "lorealrag",
      textKey: "text",
      embeddingKey: "embedding",
    });

    console.log(" Vector Store Initialized");
    return vectorStore;
  } catch (error) {
    console.error("Vector Store Initialization Error:", error);
    throw error;
  }
};

exports.getVectorStore = () => vectorStore;