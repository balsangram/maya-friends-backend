import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const services = {
  auth: "http://localhost:7001",
  // chat: "http://localhost:7002",
  // payment: "http://localhost:7003",
  // post: "http://localhost:7004",
  // user: "http://localhost:7005",
};

// Auth Service — handles /api/auth, /api/user, /api/admin
app.use(
  ["/api/auth", "/api/user", "/api/admin","/auth_health"],
  createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
  })
);

// // Chat Service
// app.use(
//   "/api/chat",
//   createProxyMiddleware({
//     target: services.chat,
//     changeOrigin: true,
//   })
// );

// // Payment Service
// app.use(
//   "/api/payment",
//   createProxyMiddleware({
//     target: services.payment,
//     changeOrigin: true,
//   })
// );

// // Post Service
// app.use(
//   "/api/post",
//   createProxyMiddleware({
//     target: services.post,
//     changeOrigin: true,
//   })
// );

// // User Service
// app.use(
//   "/api/user-service",
//   createProxyMiddleware({
//     target: services.user,
//     changeOrigin: true,
//   })
// );

// Gateway health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway is running",
    port: 7000,
  });
});

export default app;
