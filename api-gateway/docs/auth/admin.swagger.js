const adminSwagger = {
  "/admin/profile": {
    get: {
      tags: ["Admin"],
      summary: "Get admin profile",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Admin profile retrieved successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },

    put: {
      tags: ["Admin"],
      summary: "Update admin profile",
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
                  example: "Admin",
                },
                email: {
                  type: "string",
                  example: "admin@example.com",
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
          description: "Admin profile updated successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },
};

export default adminSwagger;