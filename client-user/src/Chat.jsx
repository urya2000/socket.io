import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// const BaseUrl = "https://socket-io-backend-virid.vercel.app";
const BaseUrl = "http://localhost:5000";

const socket = io(BaseUrl, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const Chat = ({ currentUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join", currentUser);

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [currentUser]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        sender: currentUser,
        receiver: "admin",
        content: message,
      };
      socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
