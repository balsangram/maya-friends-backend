import swaggerJsdoc from "swagger-jsdoc";

// =========================
// Auth Swagger
// =========================
import authSwagger from "../docs/auth/auth.swagger.js";
import adminSwagger from "../docs/auth/admin.swagger.js";
import paymentsSwagger from "../docs/auth/payments.swagger.js";
import planSwagger from "../docs/auth/plan.swagger.js";
import subscriptionsSwagger from "../docs/auth/subscriptions.swagger.js";
import userSwagger from "../docs/auth/user.swagger.js";

// =========================
// Chat Swagger
// =========================
import chatSwagger from "../docs/chat/chat.swagger.js";
import friendSwagger from "../docs/chat/friend.swagger.js";
import groupSwagger from "../docs/chat/group.swagger.js";
import messageSwagger from "../docs/chat/message.swagger.js";

// =========================
// Post Swagger
// =========================
import postSwagger from "../docs/post/post.swagger.js";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Maya Friends API Gateway",
      version: "1.0.0",
      description: "Maya Friends API Gateway Documentation",
    },

    servers: [
      {
        url: "http://192.168.0.107:7000",
        description: "API Gateway",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Authentication APIs",
      },
      {
        name: "Admin",
        description: "Admin APIs",
      },
      {
        name: "Users",
        description: "User APIs",
      },
      {
        name: "Payments",
        description: "Payment APIs",
      },
      {
        name: "Plans",
        description: "Plan APIs",
      },
      {
        name: "Subscriptions",
        description: "Subscription APIs",
      },
      {
        name: "Chat",
        description: "Chat APIs",
      },
      {
        name: "Messages",
        description: "Message APIs",
      },
      {
        name: "Friends",
        description: "Friend APIs",
      },
      {
        name: "Groups",
        description: "Group APIs",
      },
      {
        name: "Post",
        description: "Post APIs",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    paths: {
      // Auth
      ...authSwagger,
      ...adminSwagger,
      ...paymentsSwagger,
      ...planSwagger,
      ...subscriptionsSwagger,
      ...userSwagger,

      // Chat
      ...chatSwagger,
      ...friendSwagger,
      ...groupSwagger,
      ...messageSwagger,

      // Post
      ...postSwagger,
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;