const { body } = require("express-validator");
const { doValidate } = require("../../validators");

exports.addAddress = [
  body("address.city").notEmpty().withMessage("City is required"),
  body("address.details").notEmpty().withMessage("Details is required"),
  body("address.phone").notEmpty().withMessage("Phone is required"),
  body("address.postalCode").notEmpty().withMessage("Postal code is required"),
  body("address.alias").notEmpty().withMessage("Alias is required"),
  doValidate,
];
