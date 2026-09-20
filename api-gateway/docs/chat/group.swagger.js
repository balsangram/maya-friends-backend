const bearer = [{ bearerAuth: [] }];

const groupSwagger = {
  "/api/groups/{groupId}/members": {
    get: {
      tags: ["Groups"],
      summary: "Get group members",
      security: bearer,
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Group members fetched successfully" },
        401: { description: "Unauthorized" },
      },
    },
    post: {
      tags: ["Groups"],
      summary: "Add group member",
      security: bearer,
      parameters: [
        {
          name: "groupId",
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
              required: ["userId"],
              properties: {
                userId: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Member added successfully" },
        400: { description: "Bad request" },
      },
    },
  },

  "/api/groups/{groupId}/members/{userId}": {
    delete: {
      tags: ["Groups"],
      summary: "Remove group member",
      security: bearer,
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Member removed successfully" },
        404: { description: "Member not found" },
      },
    },
  },

  "/api/groups/{groupId}/members/{userId}/block": {
    patch: {
      tags: ["Groups"],
      summary: "Block group member",
      security: bearer,
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Member blocked successfully" },
      },
    },
  },

  "/api/groups/{groupId}/members/{userId}/unblock": {
    patch: {
      tags: ["Groups"],
      summary: "Unblock group member",
      security: bearer,
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Member unblocked successfully" },
      },
    },
  },

  "/api/groups/{groupId}/members/{userId}/admin": {
    patch: {
      tags: ["Groups"],
      summary: "Make group admin",
      security: bearer,
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Member promoted to admin" },
      },
    },
  },

  "/api/groups/{groupId}/members/{userId}/remove-admin": {
    patch: {
      tags: ["Groups"],
      summary: "Remove group admin",
      security: bearer,
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Admin role removed" },
      },
    },
  },

  "/api/groups/{groupId}/leave": {
    post: {
      tags: ["Groups"],
      summary: "Leave group",
      security: bearer,
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Left group successfully" },
      },
    },
  },

  "/api/groups/{groupId}": {
    patch: {
      tags: ["Groups"],
      summary: "Update group",
      security: bearer,
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: false,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "New Group Name" },
                groupImage: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Group updated successfully" },
        404: { description: "Group not found" },
      },
    },
  },
};

export default groupSwagger;
