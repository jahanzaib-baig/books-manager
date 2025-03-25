module.exports = (err, req, res, next) => {
  console.error("Error:", err.stack);

  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose Validation Errors (Bad Request: Missing fields, invalid data)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Handle MongoDB Cast Errors (Invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Duplicate Key Errors (Unique constraint violation)
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for ${field}: ${err.keyValue[field]}`;
  }

  // Handle JWT Authentication Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please log in again.";
  }

  // Handle Syntax Errors (Invalid JSON in request body)
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON syntax in request body.";
  }

  // Send JSON response with error details
  res.status(statusCode).json({ error: message });
};
