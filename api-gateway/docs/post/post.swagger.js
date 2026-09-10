const postSwagger = {
  "/posts": {
    get: {
      tags: ["Post"],
      summary: "Get all posts",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            default: 1,
          },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            default: 10,
          },
        },
      ],

      responses: {
        200: {
          description: "Posts retrieved successfully",
        },
      },
    },

    post: {
      tags: ["Post"],
      summary: "Create post",
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["content"],
              properties: {
                content: {
                  type: "string",
                  example: "Hello Maya Friends!",
                },
                image: {
                  type: "string",
                  example: "https://example.com/image.jpg",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Post created successfully",
        },
        400: {
          description: "Invalid request",
        },
      },
    },
  },

  "/posts/{postId}": {
    get: {
      tags: ["Post"],
      summary: "Get post by ID",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Post retrieved successfully",
        },
        404: {
          description: "Post not found",
        },
      },
    },

    put: {
      tags: ["Post"],
      summary: "Update post",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "postId",
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
                content: {
                  type: "string",
                  example: "Updated post content",
                },
                image: {
                  type: "string",
                  example: "https://example.com/updated.jpg",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Post updated successfully",
        },
        404: {
          description: "Post not found",
        },
      },
    },

    delete: {
      tags: ["Post"],
      summary: "Delete post",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Post deleted successfully",
        },
        404: {
          description: "Post not found",
        },
      },
    },
  },

  "/posts/{postId}/like": {
    post: {
      tags: ["Post"],
      summary: "Like post",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Post liked successfully",
        },
      },
    },
  },

  "/posts/{postId}/unlike": {
    post: {
      tags: ["Post"],
      summary: "Unlike post",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Post unliked successfully",
        },
      },
    },
  },

  "/posts/{postId}/comments": {
    get: {
      tags: ["Post"],
      summary: "Get post comments",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description: "Comments retrieved successfully",
        },
      },
    },

    post: {
      tags: ["Post"],
      summary: "Add comment to post",
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "postId",
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
              required: ["comment"],
              properties: {
                comment: {
                  type: "string",
                  example: "Nice post!",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Comment added successfully",
        },
      },
    },
  },
};

export default postSwagger;