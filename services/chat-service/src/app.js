import express from "express";
import corsMiddleware from "./middlewares/cors.middleware.js";
import friendRoutes from "./routes/friend.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import groupRoutes from "./routes/group.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import ApiError from "./utils/ApiError.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/* ==============================
   Global Middleware
============================== */

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==============================
   Swagger Documentation
============================== */

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/* ==============================
   Health Check
============================== */

app.get("/chat/health", (req, res) => {
  res.json({
    success: true,
    message: "Chat Service API is running",
  });
});

/* ==============================
   API Routes
============================== */

app.use("/api/friends", friendRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

/* ==============================
   404 Handler
============================== */

app.use((req, res, next) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
});

// IMPORTANT: error middleware must be last
app.use(errorMiddleware);

export default app;