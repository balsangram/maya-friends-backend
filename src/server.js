import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import startCronJobs from "./cron/cron.job.js";

const startServer = async () => {
  try {
    await connectDB();
    startCronJobs();
    app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();