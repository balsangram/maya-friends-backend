import { Server } from "socket.io";
import env from "./env.js";
import { verifyAccessToken } from "../utils/jwt.js";

let io;

const getTokenFromHandshake = (socket) => {
  // console.log("Handshake auth: --------------1", socket.handshake.auth);
  const authToken = socket.handshake.auth?.token;
  // console.log("Auth token from handshake:---------------------2", authToken);
  if (authToken) return authToken;

  const header = socket.handshake.headers?.authorization;
  console.log("Authorization header:---------------3", header);
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  const queryToken = socket.handshake.query?.token;
  // console.log("Token from query:---------------4", queryToken);
  if (typeof queryToken === "string" && queryToken) {
    return queryToken;
  }

  return null;
};

export const initSocket = (server) => {
  const rawOrigin = env.SOCKET_CORS_ORIGIN || env.CLIENT_URL || "*";
  const corsOrigin =
    rawOrigin === "*"
      ? "*"
      : rawOrigin.split(",").map((o) => o.trim());

  io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Require JWT before connection is accepted
  io.use((socket, next) => {
    try {
      const token = getTokenFromHandshake(socket);

      if (!token) {
        return next(new Error("Authorization token is required"));
      }

      const decoded = verifyAccessToken(token);
      socket.user = {
        id: decoded.id || decoded._id,
        email: decoded.email,
        role: decoded.role,
      };

      if (!socket.user.id) {
        return next(new Error("Invalid token payload"));
      }

      return next();
    } catch (error) {
      return next(new Error("Invalid or expired access token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // Auto-join personal room
    socket.join(`user:${userId}`);

    console.log(`Socket connected: ${socket.id} (user:${userId})`);

    socket.emit("connected", {
      success: true,
      socketId: socket.id,
      userId,
      message: "Socket connected successfully",
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}`, reason);
    });

    // Explicit join (same as auto-join; kept for client compatibility)
    socket.on("join", (payloadUserId) => {
      const id = payloadUserId || userId;
      socket.join(`user:${id}`);
      socket.emit("joined", { room: `user:${id}` });
    });

    // Join a chat room to receive live messages
    socket.on("joinChat", (chatId) => {
      if (!chatId) {
        return socket.emit("error", { message: "chatId is required" });
      }

      socket.join(`chat:${chatId}`);
      socket.emit("joinedChat", { chatId, room: `chat:${chatId}` });
      console.log(`User ${userId} joined chat:${chatId}`);
    });

    // Leave a chat room
    socket.on("leaveChat", (chatId) => {
      if (!chatId) return;
      socket.leave(`chat:${chatId}`);
      socket.emit("leftChat", { chatId });
      console.log(`User ${userId} left chat:${chatId}`);
    });

    // Typing indicators
    socket.on("typing", (payload = {}) => {
      const chatId = payload.chatId;
      if (!chatId) return;

      socket.to(`chat:${chatId}`).emit("typing", {
        chatId,
        userId,
      });
    });

    socket.on("stopTyping", (payload = {}) => {
      const chatId = payload.chatId;
      if (!chatId) return;

      socket.to(`chat:${chatId}`).emit("stopTyping", {
        chatId,
        userId,
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
