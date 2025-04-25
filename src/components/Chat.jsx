import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const user = useSelector(store => store.user);
  const userId = user?._id;

  const fetchChatMessages = async() => {
    const chat = await axios.get(BASE_URL+ "/chat/" + targetUserId, {
      withCredentials: true,
    });

    console.log(chat.data.messages);

    
    const chatMessages = chat?.data?.messages.map(msg => {
      const {senderId, text} = msg;
      return { 
        firstName: senderId?.firstName, 
        lastName : senderId?.lastName,
        text
      }; 
    });

    setMessages(chatMessages); 
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);


  useEffect(() => {
    if(!userId) {
        return; 
        //DO NOT CREATE CONNECTION when userid is not present
    };
    const socket = createSocketConnection();

    //As soon as the page loads => the socket connection is made and joinChat event is emitted

    socket.emit("joinChat", {firstName: user.firstName, userId, targetUserId}); //consider it as an api call => joinChat is the event we want to call and targetUserId is the data i want to provide


    socket.on("messageReceived", ({firstName, lastName, text }) => {
        console.log(firstName + " : "+ text);
        setMessages((messages) => [...messages, { firstName, lastName, text}]);
    }
    );
    
    return ()=> {
        socket.disconnect();//always disconnect the socket 
    }
  }, [userId, targetUserId]); //useEffect will be called only when my userId and targetUserId changes

  const sendMessage = () => {

    const socket = createSocketConnection();

    socket.emit("sendMessage", {
        firstName : user.firstName,
        lastName : user.lastName, 
        userId, 
        targetUserId, 
        text: newMessage
    });

    setNewMessage("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto border border-gray-700 rounded-2xl shadow-lg mt-8 h-[70vh] flex flex-col overflow-hidden bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 text-xl font-semibold bg-gray-800">
        Chat
        {/* Chat with {targetUserId} */}
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-900">
        {/* Example placeholder messages */}
        {messages.map((msg, index) => {
          return (
            <div key={index} className={
              "chat " + (user.firstName == msg.firstName 
            ? "chat-start" 
            : "chat-end")
            }
            >
              <div className="chat-header">
                {msg.firstName + " " + msg.lastName}
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 bg-gray-800 flex items-center gap-2">
        <input
            value = {newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
        onClick = {sendMessage}
        className="px-4 py-2 rounded-xl bg-secondary hover:bg-blue-700 transition duration-200">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
