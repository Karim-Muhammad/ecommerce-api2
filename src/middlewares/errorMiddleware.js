const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    developmentErrorHandler(err, req, res, next);
  } else {
    productionErrorHandler(err, req, res, next);
  }
};

const developmentErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    stack: err.stack,
    isOperational: err.isOperational,
  });
};

const productionErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
  });
};

module.exports = globalErrorHandler;
