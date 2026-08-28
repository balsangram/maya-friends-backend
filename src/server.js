import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import startCronJobs from "./cron/cron.job.js";
import { initializeSocket } from "./config/socket.js";
import logger from "./utils/logger.js";

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down...", error);
  process.exit(1);
});

let server;

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Start cron jobs
    startCronJobs();

    // Create HTTP server
    server = http.createServer(app);

    // Initialize Socket.IO
    initializeSocket(server);

    // Start server
    server.listen(env.PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`Socket.IO running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("UNHANDLED REJECTION! Shutting down gracefully...", reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle termination signals
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Process terminated.");
    });
  }
});

startServer();
