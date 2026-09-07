import app from "./server.js";

const PORT = process.env.PORT || 7000;
console.log(`Starting API Gateway on port ${process.env.PORT}...`);
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
