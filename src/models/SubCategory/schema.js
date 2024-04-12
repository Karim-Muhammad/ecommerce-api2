const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "SubCategory 'name' is must be exist!"],
    minLength: [2, "SubCategory 'name' has at least 2 chars!"],
    maxLength: [32, "SubCategory 'name' has at most 32 chars!"],
  },

  slug: {
    type: String,
  },

  // parent category which sub-category related to.
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category", // name of model
    required: [true, "SubCategory must be related to parent Category!"],
  },
});

module.exports = SubCategorySchema;
