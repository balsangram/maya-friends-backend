import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 7000;

console.log(
  "AUTH:",
  process.env.AUTH_SERVICE_URL,
  "CHAT:",
  process.env.CHAT_SERVICE_URL,
  "POST:",
  process.env.POST_SERVICE_URL
);

// ============================================================
// Swagger UI
// ============================================================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// ──────────────────────────────────────────────
// Proxy factory
// ──────────────────────────────────────────────
const proxy = (target) =>
  // console.log(`Proxying requests to: ${target}`) ||
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // console.log(req,"--------",path);
      return req.originalUrl;
    },

    on: {
      error: (_err, _req, res) => {
        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            message: `Upstream service unavailable (${target})`,
          });
        }
      },
    },
  });

// ──────────────────────────────────────────────
// Auth Service → 7001
// ──────────────────────────────────────────────
app.use(
  ["/api/auth", "/api/user", "/api/admin","/api/plan","/api/payments", "/api/subscriptions", "/auth/health"],
  proxy(process.env.AUTH_SERVICE_URL)
);

// ──────────────────────────────────────────────
// Chat Service → 7002
// ──────────────────────────────────────────────
app.use(
  [
    "/api/chat",
    "/api/friends",
    "/api/messages",
    "/api/groups",
    "/chat/health",
  ],
  proxy(process.env.CHAT_SERVICE_URL)
);

// ──────────────────────────────────────────────
// Post Service → 7003
// ──────────────────────────────────────────────
app.use(
  ["/api/post", "/api/posts", "/post/health"],
  proxy(process.env.POST_SERVICE_URL)
);

// ──────────────────────────────────────────────
// Gateway health
// ──────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API Gateway is running",
    port: PORT,
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      chat: process.env.CHAT_SERVICE_URL,
      post: process.env.POST_SERVICE_URL,
    },
  });
});

// ──────────────────────────────────────────────
// 404
// ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found on gateway",
  });
});

app.listen(PORT, () => {
  console.log(`-_- API Gateway running on http://localhost:${PORT}`);
});