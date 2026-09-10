const userSwagger = {
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Get all users",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Users retrieved successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/users/profile": {
    get: {
      tags: ["Users"],
      summary: "Get current user profile",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "User profile retrieved successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },

    put: {
      tags: ["Users"],
      summary: "Update current user profile",
      security: [
        {
          bearerAuth: [],
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
                  example: "Sangram Bal",
                },
                email: {
                  type: "string",
                  example: "sangram@example.com",
                },
                phone: {
                  type: "string",
                  example: "9876543210",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Profile updated successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user by ID",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "User retrieved successfully",
        },
        404: {
          description: "User not found",
        },
      },
    },
  },
};

export default userSwagger;