const ApiError = require("./ApiError");
const QueryFeatures = require("./QueryFeatures");

exports.createOne = (Model) => async (req, res, next) => {
  const document = new Model(req.body);

  try {
    await document.save();
  } catch (error) {
    return next(ApiError.badRequest(error.message));
  }

  return res.json({
    data: document,
  });
};

exports.getAll =
  (Model) =>
  async (req, res, next, filter = {}) => {
    const ModelQuery = Model.find(filter);

    const { mongooseQuery, pagination } = await new QueryFeatures(
      ModelQuery,
      req.query
    )
      .search()
      .all();

    const documents = await mongooseQuery;

    return res.status(200).json({
      pagination,
      length: documents.length,
      data: documents,
    });
  };

exports.getOne = (Model) => async (req, res, next) => {
  const document = await Model.findById(req.params.id);

  return res.status(200).json({
    data: document,
  });
};

exports.updateOne = (Model) => async (req, res, next) => {
  let document;

  try {
    document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    return next(ApiError.badRequest(error.message));
  }

  return res.json({
    data: document,
  });
};

exports.deleteOne = (Model) => async (req, res, next) => {
  await Model.findByIdAndDelete(req.params.id);

  return res.status(204).json({
    data: null,
  });
};
