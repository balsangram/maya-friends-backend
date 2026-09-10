const paymentsSwagger = {
  "/payments/create-order": {
    post: {
      tags: ["Payments"],
      summary: "Create payment order",
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
              required: ["amount"],
              properties: {
                amount: {
                  type: "number",
                  example: 499,
                },
                currency: {
                  type: "string",
                  example: "INR",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Payment order created successfully",
        },
        400: {
          description: "Bad request",
        },
      },
    },
  },

  "/payments/verify": {
    post: {
      tags: ["Payments"],
      summary: "Verify payment",
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
                razorpay_order_id: {
                  type: "string",
                  example: "order_123456",
                },
                razorpay_payment_id: {
                  type: "string",
                  example: "pay_123456",
                },
                razorpay_signature: {
                  type: "string",
                  example: "signature",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Payment verified successfully",
        },
        400: {
          description: "Payment verification failed",
        },
      },
    },
  },
};

export default paymentsSwagger;