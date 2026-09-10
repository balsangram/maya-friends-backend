const groupSwagger = {
  "/groups": {
    get: {
      tags: ["Groups"],
      summary: "Get user groups",
      security: [{ bearerAuth: [] }],

      responses: {
        200: {
          description: "Groups retrieved successfully",
        },
      },
    },

    post: {
      tags: ["Groups"],
      summary: "Create group",
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "users"],
              properties: {
                name: {
                  type: "string",
                  example: "Maya Friends",
                },
                description: {
                  type: "string",
                  example: "Friends group",
                },
                users: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: [
                    "66c123456789",
                    "66c987654321",
                  ],
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Group created successfully",
        },
        400: {
          description: "Invalid request",
        },
      },
    },
  },

  "/groups/{groupId}": {
    get: {
      tags: ["Groups"],
      summary: "Get group by ID",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Group retrieved successfully",
        },
        404: {
          description: "Group not found",
        },
      },
    },

    put: {
      tags: ["Groups"],
      summary: "Update group",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "groupId",
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
              properties: {
                name: {
                  type: "string",
                  example: "Updated Group",
                },
                description: {
                  type: "string",
                  example: "Updated description",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Group updated successfully",
        },
      },
    },

    delete: {
      tags: ["Groups"],
      summary: "Delete group",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Group deleted successfully",
        },
      },
    },
  },

  "/groups/{groupId}/members": {
    post: {
      tags: ["Groups"],
      summary: "Add member to group",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "groupId",
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
        200: {
          description: "Member added successfully",
        },
      },
    },
  },

  "/groups/{groupId}/members/{userId}": {
    delete: {
      tags: ["Groups"],
      summary: "Remove member from group",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
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
          description: "Member removed successfully",
        },
      },
    },
  },
};

export default groupSwagger;