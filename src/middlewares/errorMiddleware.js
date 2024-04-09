const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    developmentErrorHandler(err, req, res, next);
  } else {
    productionErrorHandler(err, req, res, next);
  }
};

const developmentErrorHandler = (err, req, res, next) => {
  // console.log(err);
  res.status(err.statusCode).json({
    error: {
      ...err,
      stack: err.stack,
      message: err.message,
      isOperational: err.isOperational,
    },
  });
};

const productionErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode).json({
    error: {
      status: err.statusCode,
      message: err.message,
    },
  });
};

module.exports = globalErrorHandler;
