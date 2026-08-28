import { Server } from "socket.io";

export const registerChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(
      "Socket connected:",
      socket.id
    );

    // Join chat room
    socket.on("join_chat", (chatId) => {
      if (!chatId) {
        return;
      }

      socket.join(`chat:${chatId}`);

      console.log(
        `${socket.id} joined chat:${chatId}`
      );
    });

    // Leave chat room
    socket.on("leave_chat", (chatId) => {
      if (!chatId) {
        return;
      }

      socket.leave(`chat:${chatId}`);

      console.log(
        `${socket.id} left chat:${chatId}`
      );
    });

    // Disconnect
    socket.on("disconnect", (reason) => {
      console.log(
        `Socket disconnected: ${socket.id}`,
        reason
      );
    });
  });
};