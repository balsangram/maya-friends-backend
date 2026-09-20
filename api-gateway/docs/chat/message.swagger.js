const bearer = [{ bearerAuth: [] }];

const messageSwagger = {
  "/api/messages/chat/{chatId}": {
    get: {
      tags: ["Messages"],
      summary: "Get chat messages",
      security: bearer,
      parameters: [
        {
          name: "chatId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 20 },
        },
      ],
      responses: {
        200: { description: "Messages fetched successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/messages": {
    post: {
      tags: ["Messages"],
      summary: "Send message",
      security: bearer,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["chatId"],
              properties: {
                chatId: { type: "string" },
                text: { type: "string", example: "Hello!" },
                file: { type: "string", format: "binary" },
              },
            },
          },
          "application/json": {
            schema: {
              type: "object",
              required: ["chatId"],
              properties: {
                chatId: { type: "string" },
                text: { type: "string", example: "Hello!" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Message sent successfully" },
        400: { description: "Bad request" },
      },
    },
  },

  "/api/messages/{messageId}": {
    patch: {
      tags: ["Messages"],
      summary: "Edit message",
      security: bearer,
      parameters: [
        {
          name: "messageId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["text"],
              properties: {
                text: { type: "string", example: "Updated text" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Message updated successfully" },
        404: { description: "Message not found" },
      },
    },
    delete: {
      tags: ["Messages"],
      summary: "Delete message",
      security: bearer,
      parameters: [
        {
          name: "messageId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Message deleted successfully" },
        404: { description: "Message not found" },
      },
    },
  },

  "/api/messages/{messageId}/forward": {
    post: {
      tags: ["Messages"],
      summary: "Forward message",
      security: bearer,
      parameters: [
        {
          name: "messageId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["chatId"],
              properties: {
                chatId: {
                  type: "string",
                  description: "Target chat ID",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Message forwarded successfully" },
        404: { description: "Message not found" },
      },
    },
  },

  "/api/messages/{messageId}/read": {
    patch: {
      tags: ["Messages"],
      summary: "Mark message as read",
      security: bearer,
      parameters: [
        {
          name: "messageId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Message marked as read" },
        404: { description: "Message not found" },
      },
    },
  },
};

export default messageSwagger;
