import React ,{useEffect,useState} from 'react';
import { MdAdd } from "react-icons/md";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { RiAdminLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import axios from 'axios';

function Sidebar({ isCollapsed, toggleSidebar }) {
   const [chats, setChats] = useState([]);
   const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
   const [messages, setMessages] = useState([]);
// Watch for token updates
useEffect(() => {
  const interval = setInterval(() => {
    setAuthToken(localStorage.getItem('authToken'));
  }, 1000); // Check every second

  return () => clearInterval(interval);
}, []);

console.log(authToken);

  // Fetch user's chat history
 useEffect(() => {
  const fetchChats = async () => {
    if (!authToken) return; // Prevent API call if token is missing
    try {
      const response = await axios.get("http://127.0.0.1:5001/chats/user-chats", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  fetchChats();
}, [authToken]);



const handleNewChat = async () => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/start-session",
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    if (!response.data?.thread_id) throw new Error("Invalid response from server");

    localStorage.setItem("chatID", response.data.thread_id);
    setMessages([{ role: "ai", content: "**Hello!** I'm here to chat with you." }]);

    console.log("New chat started:", response.data);
    

  } catch (error) {
    console.error("Error starting new chat:", error);
    alert("Failed to start a new chat. Please try again.");
  }
};


const loadMessages = async (thread_id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5001/chats/chat-messages/${thread_id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.data) throw new Error("Invalid response from server");

    localStorage.setItem("chatID", thread_id);
    setMessages(response.data);
    console.log("Chat messages loaded:", response.data);
    
  } catch (error) {
    console.error("Error loading chat:", error);
    alert("Failed to load chat messages. Please try again.");
  }
};



  return (
    <main className={`text-black p-4 transition-all  bg-[#EAEAEA] duration-300 ${isCollapsed ? "w-20" : "w-64"} h-screen flex flex-col `}>
      {/* Toggle Sidebar Button */}
      <button
        className="text-2xl mb-4 cursor-pointer focus:outline-none"
        onClick={toggleSidebar}
      >
        <HiMiniBars3BottomLeft className="text-4xl" />
      </button>

      {/* New Chat Button */}
      <div   onClick={handleNewChat} className="px-2 flex gap-3 items-center border-slate-700 border font-bold cursor-pointer rounded-lg py-2 hover:bg-gray-300 transition-all">
        <MdAdd className='text-4xl' />
        {!isCollapsed && "New Chat"}
      </div>
     
 {/* Chat History */}
 <div className="flex-1 overflow-y-auto mt-4">
  {chats && chats.length > 0 ? (
    chats.map(chat => (
      <div 
        key={chat.thread_id}
        onClick={() => loadMessages(chat.thread_id)}
        className="p-2 hover:bg-gray-300 rounded-lg cursor-pointer truncate"
        title={chat.updated_at ? new Date(chat.updated_at).toLocaleString() : "Unknown date"}
      >
        {!isCollapsed && (
          <>
            <span className="font-medium">
              {chat.messages?.[0]?.content?.substring(0, 30) || "New Chat"}...
            </span>
            <br />
            <span className="text-xs text-gray-600">
              {chat.updated_at ? new Date(chat.updated_at).toLocaleDateString() : "No date"}
            </span>
          </>
        )}
        {isCollapsed && <div className="w-6 h-6 bg-gray-400 rounded-full mx-auto" />}
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500">No chats available</p>
  )}
</div>


      {/* Admin Panel (Always Visible at Bottom) */}
      <Link to="/admin">
      <div className=" bg-white fixed bottom-11 cursor-pointer rounded-lg  py-2 hover:bg-gray-300 transition-all px-2 flex gap-3 items-center border-slate-700 border font-bold">
          <RiAdminLine className='text-4xl' />
          {!isCollapsed && "Index Files"}
      </div>
        </Link>
       
    </main>
  );
}

export default Sidebar;
