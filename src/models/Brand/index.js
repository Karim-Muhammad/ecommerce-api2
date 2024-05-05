const { default: mongoose } = require("mongoose");

const BrandSchema = require("./schema");
require("./middleware");

module.exports = mongoose.model("Brand", BrandSchema);
