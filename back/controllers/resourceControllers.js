
const {vectorStore} = require('../server');
//fetch indexed documents
module.exports.fetchAll = async (req, res) => {

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
  };