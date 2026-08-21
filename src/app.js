import express from "express";

import corsMiddleware from "./middlewares/cors.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import friendRoutes from "./routes/friend.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import postRoutes from "./routes/post.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
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

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Maya Friends API is running",
  });
});

/* ==============================
   API Routes
============================== */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/post", postRoutes);

// IMPORTANT: error middleware must be last
app.use(errorMiddleware);

export default app;