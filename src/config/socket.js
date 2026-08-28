import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Change this to your frontend URL in production
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`);
    });

    // Leave a room
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.id} left room: ${roomId}`);
    });

    // Join chat room
    socket.on("join_chat", (chatId) => {
      if (chatId) {
        socket.join(`chat:${chatId}`);
        console.log(`${socket.id} joined chat:${chatId}`);
      }
    });

    // Leave chat room
    socket.on("leave_chat", (chatId) => {
      if (chatId) {
        socket.leave(`chat:${chatId}`);
        console.log(`${socket.id} left chat:${chatId}`);
      }
    });

    // Example message
    socket.on("message", (data) => {
      console.log("Message received:", data);

      io.emit("message", data);
    });

    // Disconnect
    socket.on("disconnect", (reason) => {
      console.log(
        `Socket disconnected: ${socket.id}`,
        reason
      );
    });

    // Socket error
    socket.on("error", (error) => {
      console.error(
        `Socket error (${socket.id}):`,
        error
      );
    });
  });

  console.log("Socket.IO initialized");

  return io;
};

// Get Socket.IO instance from anywhere in your application
export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized. Call initializeSocket(server) first."
    );
  }

  return io;
};