import React, { useEffect, useState } from "react";
import io from "socket.io-client";

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
      // Check for duplicates based on content and sender
      if (
        !messages.some(
          (msg) =>
            msg.content === message.content && msg.sender === message.sender
        )
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [currentUser, messages]);

  const sendMessage = (receiver) => {
    if (message.trim() === "") return; // Prevent empty messages

    const messageData = {
      sender: currentUser,
      receiver: receiver,
      content: message,
    };
    socket.emit("sendMessage", messageData);
    setMessage("");
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
        placeholder="Type a message"
      />
      <button onClick={() => sendMessage("user1")}>Send to User1</button>
      <button onClick={() => sendMessage("user2")}>Send to User2</button>
    </div>
  );
};

export default Chat;
