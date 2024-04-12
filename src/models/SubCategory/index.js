const mongoose = require("mongoose");
const SubCategorySchema = require("./schema");
require("./middlewares");
require("./virtual");

const SubCategoryModel = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategoryModel;
