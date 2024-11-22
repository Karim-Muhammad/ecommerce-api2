const developmentErrorHandler = (err, _req, res, _next) => {
  // console.log(err);
  console.log(err);
  res.status(err.statusCode || 500).json({
    error: {
      ...err.bag.reduce((acc, curr) => {
        acc[curr.field] = curr.message;
        return acc;
      }, {}),
      // why below exists so!??
      stack: err.stack,
      message: err.message,
      isOperational: err.isOperational,
    },
  });
};

const productionErrorHandler = (err, _req, res, _next) => {
  res.status(err?.statusCode || 500).json({
    error: {
      ...err.bag.reduce((acc, curr) => {
        acc[curr.field] = curr.message;
        return acc;
      }, {}),
      message: err.message,
    },
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    developmentErrorHandler(err, req, res, next);
  } else {
    productionErrorHandler(err, req, res, next);
  }
};

module.exports = globalErrorHandler;
