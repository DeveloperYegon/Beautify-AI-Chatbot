// src/Components/ChatInterface.jsx

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setThreadId, setMessages } from '../redux/chatSlice';
import Chat from '../Pages/Chat';

function ChatInterface({ newChat = false }) {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const apiUrl = import.meta.env.VITE_API_KEY;
  
  useEffect(() => {
    if (threadId) {
      // Load existing chat
      const loadChat = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}:5001/chats/chat-messages/${threadId}`,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          dispatch(setMessages(response.data));
          dispatch(setThreadId(threadId));
        } catch (error) {
          //console.error('Error loading chat:', error);
        }
      };

      loadChat();
    } else if (newChat) {
      // Handle new chat creation
      dispatch(setThreadId(null));
      dispatch(setMessages([]));
    }
  }, [threadId, newChat, authToken, dispatch]);

  return (
    // Your chat UI implementation
    <>
    <Chat/>
    </>
  );
}

export default ChatInterface;