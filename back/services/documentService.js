// services/documentService.js
const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { getVectorStore } = require("../config/vectorstore");

exports.processURL = async (url) => {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();
  await getVectorStore().addDocuments(docs.map(doc => ({
    ...doc,
    metadata: { ...doc.metadata, source: "web", url }
  })));

  return docs.length;
};

exports.processPDF = async (filePath, originalName) => {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  await getVectorStore().addDocuments(docs.map(doc => ({
    ...doc,
    metadata: { ...doc.metadata, source: "pdf", filename: originalName }
  })));
  return docs.length;
};


exports.fetchAllDocuments = async () => {
  const store = getVectorStore();
  return store.similaritySearch("", 1000);
};