const subscriptionsSwagger = {
  "/subscriptions": {
    get: {
      tags: ["Subscriptions"],
      summary: "Get current user subscription",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Subscription retrieved successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/subscriptions/subscribe": {
    post: {
      tags: ["Subscriptions"],
      summary: "Subscribe to a plan",
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
              required: ["planId"],
              properties: {
                planId: {
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
          description: "Subscription created successfully",
        },
        400: {
          description: "Invalid subscription request",
        },
      },
    },
  },

  "/subscriptions/cancel": {
    post: {
      tags: ["Subscriptions"],
      summary: "Cancel subscription",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Subscription cancelled successfully",
        },
        404: {
          description: "Subscription not found",
        },
      },
    },
  },
};

export default subscriptionsSwagger;