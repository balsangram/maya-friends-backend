import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      console.log(`❌ User disconnected: ${socket.id}`, reason);
    });

    // Join personal user room
    socket.on("join", (userId) => {
      socket.join(`user:${userId}`);

      console.log(
        `👤 User ${userId} joined room user:${userId}`
      );
    });

    // Join chat room
    socket.on("joinChat", (chatId) => {
      socket.join(`chat:${chatId}`);

      console.log(
        `💬 Socket ${socket.id} joined chat:${chatId}`
      );
    });

    // Leave chat room
    socket.on("leaveChat", (chatId) => {
      socket.leave(`chat:${chatId}`);

      console.log(
        `🚪 Socket ${socket.id} left chat:${chatId}`
      );
    });

    // Send message
    socket.on("sendMessage", (data) => {
      const { chatId, message } = data;

      io.to(`chat:${chatId}`).emit("newMessage", {
        chatId,
        message,
      });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};