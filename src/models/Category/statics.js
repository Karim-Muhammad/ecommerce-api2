const CategorySchema = require("./schema");

// Statics | Methods
// fillable property for assigning values

/**
 * @description get all allowed fillable fields
 * @returns {Array} fillable fields
 * @static
 */
CategorySchema.static("fillable", () => ["name", "description", "status"]);

/**
 * @description check if all passed keys are part of fillable fields or not
 * @param {Array} keys
 * @returns {Boolean} true if all keys are fillable, false otherwise
 * @static
 */
CategorySchema.static("isFillable", function (keys) {
  if (!keys || Object.keys(keys).length === 0) return false;
  return keys.every((key) => this.fillable().includes(key));
});
