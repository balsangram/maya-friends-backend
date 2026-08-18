const errorMiddleware = (error, req, res, next) => {
  console.error("Error:", error);

  const statusCode = error.statusCode || 500;

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map(
      (err) => err.message
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];

    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export default errorMiddleware;