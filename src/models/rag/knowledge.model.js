const knowledgeSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },

    embedding: {
        type: [Number],
        required: true,
    },

    metadata: {
        type: Object,
    },
});