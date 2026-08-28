import { Server } from "socket.io";

import { registerChatSocket } from "./chat.socket.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  // Register all socket events
  registerChatSocket(io);

  console.log("Socket.IO initialized");

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};