const bearer = [{ bearerAuth: [] }];

const friendSwagger = {
  "/api/friends/v1": {
    get: {
      tags: ["Friends"],
      summary: "List friends or blocked users",
      description:
        "Returns friends when `blockUser=false` (default). Returns only blocked users when `blockUser=true`.",
      security: bearer,
      parameters: [
        {
          name: "blockUser",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["true", "false"],
            default: "false",
          },
          description: "Set true to list blocked users only",
        },
        {
          name: "search",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Search by username or name",
        },
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", default: 1 },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", default: 10 },
        },
      ],
      responses: {
        200: {
          description: "Friends / blocked users fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        userId: { type: "string" },
                        username: { type: "string" },
                        name: { type: "string", nullable: true },
                        image: { type: "string", nullable: true },
                        type: {
                          type: "string",
                          enum: ["friend", "best_friend", "close_friend"],
                        },
                      },
                    },
                  },
                  pagination: { type: "object" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/friends/v1/add": {
    post: {
      tags: ["Friends"],
      summary: "Add friend",
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
        200: { description: "Friend added successfully" },
        400: { description: "Bad request" },
        404: { description: "Friend user not found" },
      },
    },
  },

  "/api/friends/v1/unfriend": {
    post: {
      tags: ["Friends"],
      summary: "Remove friend",
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
        200: { description: "Friend removed successfully" },
        404: { description: "Friend record not found" },
      },
    },
  },

  "/api/friends/v1/block/{friendId}": {
    patch: {
      tags: ["Friends"],
      summary: "Block or unblock a user",
      security: bearer,
      parameters: [
        {
          name: "friendId",
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
              required: ["action"],
              properties: {
                action: {
                  type: "string",
                  enum: ["block", "unblock"],
                  example: "block",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Block/unblock successful" },
        400: { description: "Invalid action" },
        404: { description: "User not found" },
      },
    },
  },
};

export default friendSwagger;
