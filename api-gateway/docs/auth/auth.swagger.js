const authSwagger = {
  "/api/auth/v1/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      description: "Creates a new user account.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["username", "email", "password"],

              properties: {
                username: {
                  type: "string",
                  example: "Earl.Kovacek78",
                },

                email: {
                  type: "string",
                  format: "email",
                  example: "jyotiranjanpal.sipu@gmail.com",
                },

                password: {
                  type: "string",
                  format: "password",
                  example: "1234",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "User registered successfully",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },

                  message: {
                    type: "string",
                    example: "User registered successfully",
                  },

                  data: {
                    type: "object",

                    properties: {
                      id: {
                        type: "string",
                        example: "6aa32159172088d9d4ed5cdb",
                      },

                      username: {
                        type: "string",
                        example: "Earl.Kovacek78",
                      },

                      email: {
                        type: "string",
                        example: "pal@gmail.com",
                      },

                      role: {
                        type: "string",
                        example: "User",
                      },
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Bad request",
        },
      },
    },
  },

  "/api/auth/v1/login": {
  post: {
    tags: ["Auth"],
    summary: "Login user",
    description: "Authenticate a user and return access and refresh tokens.",

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: ["email", "password"],

            properties: {
              email: {
                type: "string",
                format: "email",
                example: "balsangram04@gmail.com",
              },

              password: {
                type: "string",
                format: "password",
                example: "1234",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description: "User logged in successfully",

        content: {
          "application/json": {
            schema: {
              type: "object",

              properties: {
                success: {
                  type: "boolean",
                  example: true,
                },

                message: {
                  type: "string",
                  example: "User logged in successfully",
                },

                data: {
                  type: "object",

                  properties: {
                    id: {
                      type: "string",
                      example: "6a84a773851467a49aecf846",
                    },

                    username: {
                      type: "string",
                      example: "education",
                    },

                    email: {
                      type: "string",
                      example: "balsangram04@gmail.com",
                    },

                    role: {
                      type: "string",
                      example: "User",
                    },

                    accessToken: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIs...",
                    },

                    refreshToken: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIs...",
                    },
                  },
                },
              },
            },
          },
        },
      },

      400: {
        description: "Invalid email or password",
      },

      401: {
        description: "Unauthorized",
      },
    },
  },
},

"/api/auth/v1/logout": {
  post: {
    tags: ["Auth"],
    summary: "Logout user",
    description:
      "Logs out the user by invalidating the refresh token and FCM token.",

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: ["refreshToken"],

            properties: {
              fcmToken: {
                type: "string",
                example: "",
                description: "FCM device token. Can be empty.",
              },

              refreshToken: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIs...",
                description: "Refresh token received during login.",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description: "User logged out successfully",

        content: {
          "application/json": {
            schema: {
              type: "object",

              properties: {
                success: {
                  type: "boolean",
                  example: true,
                },

                message: {
                  type: "string",
                  example: "User logged out successfully",
                },
              },
            },
          },
        },
      },

      400: {
        description: "Invalid refresh token or request",
      },

      401: {
        description: "Unauthorized",
      },
    },
  },
},

};

export default authSwagger;