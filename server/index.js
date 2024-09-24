const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://socket-io-admin-five.vercel.app",
      "https://socket-io-flame.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://socket-io-admin-five.vercel.app",
      "https://socket-io-flame.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://mabinaya2112:eirMqt43N169P1AM@cluster0.a8vdf5i.mongodb.net/chatapp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Models
const MessageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", MessageSchema);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (user) => {
    console.log(`${user} joined the room`);
    socket.join(user);
  });

  socket.on("adminConnect", () => {
    console.log("Admin connected");
    socket.join("admin");
  });

  socket.on("sendMessage", async (message) => {
    try {
      console.log("Sending message:", message);
      const newMessage = new Message(message);
      await newMessage.save();

      io.to(message.receiver).emit("receiveMessage", message);
      io.to(message.sender).emit("receiveMessage", message);
      io.to("admin").emit("receiveMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
