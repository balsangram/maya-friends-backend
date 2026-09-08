import express from "express";
const router = express.Router();
import { testEmbedding } from "../controllers/test/test.controller.js";

router.get("/test-embedding", testEmbedding);
export default router;