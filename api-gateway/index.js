import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = 7000;

// ──────────────────────────────────────────────
// Proxy factory — forwards full path, handles errors
// ──────────────────────────────────────────────
const proxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      error: (_err, _req, res) => {
        res.status(502).json({
          success: false,
          message: `Upstream service unavailable (${target})`,
        });
      },
    },
  });

// ──────────────────────────────────────────────
// Auth Service → 7001
// Routes: /api/auth/v1/*, /api/user/*, /api/admin/*, /auth/health
// ──────────────────────────────────────────────
app.use(
  ["/api/auth", "/api/user", "/api/admin", "/auth/health"],
  proxy(process.env.AUTH_SERVICE_URL)
);

// ──────────────────────────────────────────────
// Chat Service → 7002
// Routes: /api/chat/*, /api/friends/*, /api/messages/*, /api/groups/*, /chat/health
// ──────────────────────────────────────────────
app.use(
  ["/api/chat", "/api/friends", "/api/messages", "/api/groups", "/chat/health"],
  proxy(process.env.CHAT_SERVICE_URL)
);

// ──────────────────────────────────────────────
// Post Service → 7003
// Routes: /api/post/*, /api/posts/*, /post/health
// ──────────────────────────────────────────────
app.use(
  ["/api/post", "/api/posts", "/post/health"],
  proxy(process.env.POST_SERVICE_URL)
);

// ──────────────────────────────────────────────
// Gateway health check
// ──────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API Gateway is running",
    port: PORT,
    services: {
      auth:    process.env.AUTH_SERVICE_URL,
      chat:    process.env.CHAT_SERVICE_URL,
      post:    process.env.POST_SERVICE_URL,
    },
  });
});

// ──────────────────────────────────────────────
// 404 fallback
// ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found on gateway" });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});
