
// services/ragService.js
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { getVectorStore } = require("../config/vectorstore");
const {START, END, MessagesAnnotation, StateGraph ,MemorySaver}= require("@langchain/langgraph");

class RagService {
  static #llm;
  static #workflow;

  static async initialize() {
    this.#llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-1.5-flash",
      temperature: 0
    });
    
    this.#workflow = this.createRAGWorkflow(this.#llm);
  }

  static createRAGWorkflow(llm) {
    const workflow = new StateGraph(MessagesAnnotation)
      .addNode("retrieve", async (state) => {
        const { messages } = state;
        const question = messages[messages.length - 1].content;
        const relevantDocs = await getVectorStore().similaritySearch(question, 3);
        return { 
          messages,
          context: relevantDocs.map(doc => doc.pageContent).join("\n")
        };
      })
      .addNode("generate", async (state) => {
        const { messages, context } = state;
        const response = await llm.invoke([
          { 
            role: "system", 
            content: "You are a beauty expert trained by Tilt Technologies. " +
                     "Only answer questions related to skincare, cosmetics, and beauty. " +
                     "If the question is unrelated, politely refuse to answer."
          },
          ...messages,
          { role: "user", content: `Context: ${context}\nQuestion: ${messages[messages.length - 1].content}` }
        ]);
        return { messages: [...messages, { role: "ai", content: response.content }] };
      });

    workflow
      .addEdge(START, "retrieve")
      .addEdge("retrieve", "generate")
      .addEdge("generate", END);

    return workflow.compile({ checkpointer: new MemorySaver() });
  }

  static async processQuestion(question, threadId) {
    if (!this.#workflow) await this.initialize();
    
    const config = { configurable: { thread_id: threadId } };
    const initialState = { messages: [{ role: "user", content: question }] };
    
    const result = await this.#workflow.invoke(initialState, config);
    return result.messages.slice(-1)[0].content;
  }
}

module.exports = RagService;