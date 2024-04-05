const CategorySchema = require("./schema");

// Virtuals | Computed Properties
CategorySchema.virtual("url").get(function () {
  return `/api/v1/categories/${this.slug}`;
});
