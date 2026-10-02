// src/middlewares/error.middleware.js
export function errorHandler(err, req, res, next) {
  // Response আগেই শুরু হয়ে গেলে Express-এর ডিফল্ট handler-এর হাতে ছাড়ুন
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: isServerError ? "Internal server error" : err.message,
  });
}



