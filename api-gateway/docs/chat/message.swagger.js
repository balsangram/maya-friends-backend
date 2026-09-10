const messageSwagger = {
  "/messages": {
    post: {
      tags: ["Messages"],
      summary: "Send message",
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["conversationId", "message"],
              properties: {
                conversationId: {
                  type: "string",
                  example: "66c123456789",
                },
                message: {
                  type: "string",
                  example: "Hello, how are you?",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Message sent successfully",
        },
        400: {
          description: "Invalid request",
        },
      },
    },
  },

  "/messages/{conversationId}": {
    get: {
      tags: ["Messages"],
      summary: "Get conversation messages",
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
        {
          name: "page",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            default: 1,
          },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            default: 20,
          },
        },
      ],

      responses: {
        200: {
          description: "Messages retrieved successfully",
        },
      },
    },
  },

  "/messages/{messageId}": {
    put: {
      tags: ["Messages"],
      summary: "Edit message",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "messageId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["message"],
              properties: {
                message: {
                  type: "string",
                  example: "Updated message",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Message updated successfully",
        },
        404: {
          description: "Message not found",
        },
      },
    },

    delete: {
      tags: ["Messages"],
      summary: "Delete message",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "messageId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Message deleted successfully",
        },
        404: {
          description: "Message not found",
        },
      },
    },
  },

  "/messages/{messageId}/seen": {
    put: {
      tags: ["Messages"],
      summary: "Mark message as seen",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "messageId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Message marked as seen",
        },
      },
    },
  },
};

export default messageSwagger;