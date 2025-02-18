import { useState } from "react";
import axios from "axios";


function Dashboard() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        messages: [...messages, userMessage],
      });
      const aiMessage = {
        role: "ai",
        content: response.data.kwargs.content,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };


  return (
    <main className="h-screen">
      <h1>LangChain Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "ai"}`}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </main>
  )
}

export default Dashboard