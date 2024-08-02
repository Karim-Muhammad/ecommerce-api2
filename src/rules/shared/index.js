const validator = require("express-validator");
const ApiError = require("../../utils/ApiError");
const { doValidate } = require("../../validators");

exports.ensureIdMongoIdRule = (Model) => [
  validator
    .param("id")
    .isMongoId()
    .withMessage(`${Model.collection.collectionName} ID is not valid!`),
  doValidate,
];

exports.isIdMongoIdExistsRule = (Model) => [
  validator.param("id").custom(async (id) => {
    const document = await Model.findById(id);

    if (!document)
      throw ApiError.notFound(
        `this resource ${Model.collection.collectionName} not found`
      );

    return true;
  }),

  doValidate,
];
