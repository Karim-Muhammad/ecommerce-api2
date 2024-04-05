const mongoose = require("mongoose");
const CategorySchema = require("./schema");
require("./virtual");
require("./statics");
require("./middlewares");

//   Create Model
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
