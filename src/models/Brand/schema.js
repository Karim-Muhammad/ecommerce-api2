const { Schema } = require("mongoose");

const BrandSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, "Too short category {PATH}, min is {VALUE}"],
    maxlength: [32, "Too long category {PATH}, max is {VALUE}"],
  },

  description: {
    type: String,
    trim: true,
  },

  image: {
    type: String,
    trim: true,
  },

  status: {
    type: Boolean,
    default: true,
  },

  slug: {
    type: String,
    lowercase: true,
    trim: true,
  },
});

module.exports = BrandSchema;
