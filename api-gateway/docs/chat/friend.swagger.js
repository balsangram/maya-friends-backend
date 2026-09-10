const friendSwagger = {
  "/friends": {
    get: {
      tags: ["Friends"],
      summary: "Get friends",
      security: [{ bearerAuth: [] }],

      responses: {
        200: {
          description: "Friends retrieved successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },

    post: {
      tags: ["Friends"],
      summary: "Send friend request",
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
          description: "Friend request sent successfully",
        },
        400: {
          description: "Invalid request",
        },
      },
    },
  },

  "/friends/requests": {
    get: {
      tags: ["Friends"],
      summary: "Get pending friend requests",
      security: [{ bearerAuth: [] }],

      responses: {
        200: {
          description: "Friend requests retrieved successfully",
        },
      },
    },
  },

  "/friends/{userId}/accept": {
    put: {
      tags: ["Friends"],
      summary: "Accept friend request",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Friend request accepted successfully",
        },
        404: {
          description: "Friend request not found",
        },
      },
    },
  },

  "/friends/{userId}/reject": {
    put: {
      tags: ["Friends"],
      summary: "Reject friend request",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Friend request rejected successfully",
        },
      },
    },
  },

  "/friends/{userId}": {
    delete: {
      tags: ["Friends"],
      summary: "Remove friend",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Friend removed successfully",
        },
        404: {
          description: "Friend not found",
        },
      },
    },
  },
};

export default friendSwagger;