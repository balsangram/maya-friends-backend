import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import startCronJobs from "./cron/cron.job.js";
import { initializeSocket } from "./config/socket.js";


const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Start cron jobs
    startCronJobs();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    initializeSocket(server);

    // Start server
    server.listen(
      env.PORT,
      "0.0.0.0",
      () => {
        console.log(
          `Server running on port ${env.PORT}`
        );

        console.log(
          `Socket.IO running on port ${env.PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();