import React ,{useEffect,useState} from 'react';
import { MdAdd } from "react-icons/md";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { RiAdminLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import axios from 'axios';

function Sidebar({ isCollapsed, toggleSidebar ,setMessages }) {
  const [chats, setChats] = useState([]);
   const token = localStorage.getItem('authToken');

  // Fetch user's chat history
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/chats/user-chats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    
    if (token) fetchChats();
  }, [token]);


  const handleNewChat = async () => {
    const response = await axios.post("http://127.0.0.1:5001/start-session", {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { thread_id } = response.data;
    localStorage.setItem('chatID', thread_id);
    setMessages([{ role: "ai", content: "**Hello!** I'm here to chat with you." }]);
  };


  const loadMessages = async (thread_id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5001/chats/chat-messages/${thread_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('chatID', thread_id);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading chat:", error);
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
        {chats.map(chat => (
          <div 
            key={chat.thread_id}
            onClick={() => loadMessages(chat.thread_id)}
            className="p-2 hover:bg-gray-300 rounded-lg cursor-pointer truncate"
            title={new Date(chat.updated_at).toLocaleString()}
          >
            {!isCollapsed && (
              <>
                <span className="font-medium">
                  {chat.messages?.[0]?.content?.substring(0, 30) || "New Chat"}...
                </span>
                <br />
                <span className="text-xs text-gray-600">
                  {new Date(chat.updated_at).toLocaleDateString()}
                </span>
              </>
            )}
            {isCollapsed && <div className="w-6 h-6 bg-gray-400 rounded-full mx-auto" />}
          </div>
        ))}
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
