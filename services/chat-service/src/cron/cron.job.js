import cron from "node-cron";

const startCronJobs = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const response = await fetch("http://192.168.0.107:7000/");

      const data = await response.text();

      console.log("Cron API response:", data);
    } catch (error) {
      console.error("Cron API failed:", error.message);
    }
  });

  console.log("Cron job started - runs every 10 minutes");
};

export default startCronJobs;