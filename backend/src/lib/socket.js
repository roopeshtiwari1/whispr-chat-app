import { Server } from "socket.io";
import http from "http";
import express from "express";
import {subscriber} from "./redisClient.js"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  path: "/socket.io/" 
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // subscriber from redis

  subscriber.subscribe("messages")

  subscriber.on("message", (channel, message) => {
    const parsedMessage = JSON.parse(message)
    console.log("subscriber main enter", parsedMessage)
    const receiverSocketId = getReceiverSocketId(parsedMessage.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", parsedMessage);
    }
    
  })
  
});

export { io, app, server };