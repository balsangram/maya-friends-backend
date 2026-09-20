const bearer = [{ bearerAuth: [] }];

const chatSwagger = {
  "/api/chats/private": {
    post: {
      tags: ["Chat"],
      summary: "Create private chat",
      security: bearer,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["friendId"],
              properties: {
                friendId: {
                  type: "string",
                  example: "6a8349fe7a9ab2797ec0badf",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Private chat created / fetched successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/chats/group": {
    post: {
      tags: ["Chat"],
      summary: "Create group chat",
      security: bearer,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["name", "members"],
              properties: {
                name: { type: "string", example: "Weekend Trip" },
                members: {
                  type: "string",
                  description: "JSON array of user IDs or comma-separated IDs",
                  example: '["6a8349fe7a9ab2797ec0badf"]',
                },
                groupImage: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Group chat created successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/chats": {
    get: {
      tags: ["Chat"],
      summary: "List user chats",
      security: bearer,
      responses: {
        200: { description: "Chats fetched successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/chats/{chatId}": {
    get: {
      tags: ["Chat"],
      summary: "Get chat details",
      security: bearer,
      parameters: [
        {
          name: "chatId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Chat details fetched successfully" },
        404: { description: "Chat not found" },
      },
    },
    delete: {
      tags: ["Chat"],
      summary: "Delete / deactivate chat",
      security: bearer,
      parameters: [
        {
          name: "chatId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Chat deleted successfully" },
        404: { description: "Chat not found" },
      },
    },
  },
};

export default chatSwagger;
