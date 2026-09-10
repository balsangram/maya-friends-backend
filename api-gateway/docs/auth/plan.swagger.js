const planSwagger = {
  "/plans": {
    get: {
      tags: ["Plans"],
      summary: "Get all plans",
      responses: {
        200: {
          description: "Plans retrieved successfully",
        },
      },
    },

    post: {
      tags: ["Plans"],
      summary: "Create a plan",
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
              required: ["name", "price", "interval"],
              properties: {
                name: {
                  type: "string",
                  example: "Premium",
                },
                price: {
                  type: "number",
                  example: 499,
                },
                interval: {
                  type: "string",
                  enum: ["month", "year"],
                  example: "month",
                },
                features: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: ["Unlimited chat", "Premium features"],
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Plan created successfully",
        },
      },
    },
  },

  "/plans/{id}": {
    get: {
      tags: ["Plans"],
      summary: "Get plan by ID",
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
          description: "Plan retrieved successfully",
        },
        404: {
          description: "Plan not found",
        },
      },
    },

    put: {
      tags: ["Plans"],
      summary: "Update plan",
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
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                price: {
                  type: "number",
                },
                interval: {
                  type: "string",
                  enum: ["month", "year"],
                },
                features: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Plan updated successfully",
        },
      },
    },

    delete: {
      tags: ["Plans"],
      summary: "Delete plan",
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
          description: "Plan deleted successfully",
        },
      },
    },
  },
};

export default planSwagger;