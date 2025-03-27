import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { BsFillSendFill } from "react-icons/bs";
import { FaCircleStop } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { clearThreadId } from "../redux/threadSlice";
import { useNavigate  } from "react-router-dom";

function Chat() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const thread_id = useSelector((state) => state.thread.threadId); // Get thread ID from Redux
  const message = useSelector((state) => state.chat.messages);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

    // Sync Redux state with local state
    useEffect(() => {
      setMessages(message);
    }, [message]);

   // Check for token expiry on component mount
   useEffect(() => {
    if (!token || isTokenExpired(token)) {
      dispatch(logout());
      navigate("/login");
      dispatch(clearThreadId()); // Clears thread ID on logout
    }
  }, [token, dispatch]);

   // Helper function to check token expiry
   function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    // Show loading state
    setLoading(true);
    // Update UI immediately
    setMessages((prev) => [...prev, { role: "user", content: question, createdAt: Date.now() }]);
    setQuestion("");

    try {
      const response = await axios.post("http://localhost:5001/ask", { question, thread_id },{
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      }
    );    
    
    if (response.data) {
      setMessages((prev) => [...prev, { role: "ai", content: response.data, createdAt: Date.now() }]);
    }
    } catch (error) {
      console.error("Error asking question:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I encountered an error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex flex-col w-fit gap-1 md:mx-5 mx-2 p-3 bg-gray-100  overflow-auto">

      {/* Chat Display */}
      <div className="md:p-10 bg-white rounded-2xl mb-10 overflow-auto flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "5px 0",
              padding: "8px",
              borderRadius: "5px",
              background: msg.role === "user" ? "#CAD5E2" : "#EAEAEA",
              color: msg.role === "user" ? "black" : "black",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
            
            {/* Check if AI response contains multiple sections */}
            {msg.role === "ai" && msg.content && typeof msg.content === "object" ? (
              <div>
                {/*  Display AI Answer */}
                <ReactMarkdown className="mb-3">{msg.content.answer}</ReactMarkdown>

                {/*  Display Article Recommendations */}
                {msg.content.articles && msg.content.articles.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg">Recommended Articles:</h3>
                    <ul className="list-disc ml-5">
                      {msg.content.articles.map((article, idx) => (
                        <li key={idx}>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {article.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ✅ Display Product Recommendation Link */}
                {msg.content.productLink && (
                  <div className="mt-3">
                    <h3 className="font-bold text-lg">Product Recommendation:</h3>
                    <a
                      href={msg.content.productLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Recommended Product
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <ReactMarkdown>{typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)}</ReactMarkdown>
            )}
          </div>
        ))}
        {loading && (
          <p style={{ textAlign: "center", color: "green", marginTop: "10px" }}>
            <FaCircleStop className="animate-spin text-4xl" />
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Form Input */}
      <form
        onSubmit={handleSubmit}
        className="md:mx-20 sticky bottom-30 bg-white my-5 flex flex-row border border-slate-300 gap-2 rounded-lg p-3"
      >
        <textarea
          type="text"
          className="bg-white w-full p-4 border-slate-100 border rounded-2xl text-black"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          cols={30}
        ></textarea>

        <button
          type="submit"
          className="text-[#000] px-4 py-2 rounded-lg cursor-pointer"
          disabled={loading}
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? <FaCircleStop className="animate-spin text-4xl" /> : <BsFillSendFill className="text-4xl" />}
        </button>
      </form>
    </main>
  );
}

export default Chat;
