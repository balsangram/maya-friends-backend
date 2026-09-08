import { createEmbedding } from "../../services/rag/embedding.services.js";

export const testEmbedding = async (req, res) => {
    try {
        const text =
            "Paracetamol is commonly used to relieve pain and reduce fever.";

        const embedding = await createEmbedding(text);

        return res.status(200).json({
            success: true,
            text,
            dimensions: embedding.length,
            firstFiveValues: embedding.slice(0, 5),
        });
    } catch (error) {
        console.error("Embedding error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};