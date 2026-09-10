const chatSwagger = {
  "/chat/conversations": {
    get: {
      tags: ["Chat"],
      summary: "Get user conversations",
      security: [{ bearerAuth: [] }],

      responses: {
        200: {
          description: "Conversations retrieved successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/chat/conversations/{conversationId}": {
    get: {
      tags: ["Chat"],
      summary: "Get conversation details",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "conversationId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Conversation retrieved successfully",
        },
        404: {
          description: "Conversation not found",
        },
      },
    },
  },

  "/chat/conversations": {
    post: {
      tags: ["Chat"],
      summary: "Create a conversation",
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["userId"],
              properties: {
                userId: {
                  type: "string",
                  example: "66c123456789",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Conversation created successfully",
        },
        400: {
          description: "Invalid request",
        },
      },
    },
  },
};

export default chatSwagger;