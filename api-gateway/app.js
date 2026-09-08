import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const services = {
  auth: process.env.AUTH_SERVICE_URL,
  chat: process.env.CHAT_SERVICE_URL,
  post: process.env.POST_SERVICE_URL,
};

// Auth Service
app.use(
  ["/api/auth", "/api/user", "/api/admin", "/auth_health"],
  createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
  })
);

// Chat Service
app.use(
  "/api/chat",
  createProxyMiddleware({
    target: services.chat,
    changeOrigin: true,
  })
);

// Post Service
app.use(
  ["/api/post", "/post_health"],
  createProxyMiddleware({
    target: services.post,
    changeOrigin: true,
  })
);

// Gateway health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway is running",
    port: process.env.PORT || 7000,
  });
});

export default app;