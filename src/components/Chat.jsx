import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const scrollRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = res.data?.messages.map((msg) => ({
        firstName: msg.senderId?.firstName,
        lastName: msg.senderId?.lastName,
        text: msg.text,
        time: msg.createdAt
      }));
      setMessages(chatMessages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text, time: new Date().toISOString() }]);
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    // Optional: Optimistically add message to UI
    setMessages((prev) => [...prev, { firstName: user.firstName, lastName: user.lastName, text: newMessage, time: new Date().toISOString() }]);
    setNewMessage("");
  };

  const formatIST = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-10 border border-gray-700 rounded-3xl bg-base-300 shadow-2xl h-[80vh] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="px-8 py-4 border-b border-gray-700 bg-base-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-xl font-bold text-white tracking-wide">Chat</h1>
        </div>
        <span className="text-xs opacity-50 font-mono">End-to-end Encrypted</span>
      </div>

      {/* Messages Window */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar"
      >
        {messages.map((msg, index) => {
          const isMe = user.firstName === msg.firstName;
          return (
            <div key={index} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
              <div className="chat-header pb-1 flex items-center gap-2">
                <span className="text-sm font-semibold opacity-90">
                  {isMe ? "You" : `${msg.firstName} ${msg.lastName}`}
                </span>
                <time className="text-[10px] opacity-40 uppercase">{formatIST(msg.time)}</time>
              </div>
              
              <div className={`chat-bubble text-sm md:text-base leading-relaxed shadow-lg ${
                isMe ? "chat-bubble-primary text-white" : "chat-bubble-neutral"
              }`}>
                {msg.text}
              </div>
              
              <div className="chat-footer opacity-40 text-[10px] pt-1">
                {isMe ? "Sent" : "Received"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Section */}
      <div className="p-6 bg-base-200 border-t border-gray-700">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Write your message..."
            className="flex-1 input input-bordered rounded-full bg-base-100 border-gray-600 focus:border-primary focus:outline-none px-6"
          />
          <button 
            onClick={sendMessage} 
            className="btn btn-primary btn-circle shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;