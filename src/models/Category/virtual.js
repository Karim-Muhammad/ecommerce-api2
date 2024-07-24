/**
 * "Virtuals" are computed properties: you can access virtuals on hydrated Mongoose documents,
 *  but virtuals are not stored in MongoDB
 */
const CategorySchema = require("./schema");

// Virtuals | Computed Properties
CategorySchema.virtual("url").get(function () {
  return `/api/v1/categories/${this.slug}`;
});

CategorySchema.virtual("categories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "category",
});

// you can now fetch all sub-categories which is related to parent one, by this inverse one!
// this is more faster, and less usage in memory than embed each entitiy with other tables in  schema
// [read](https://dev.to/oluseyeo/how-to-create-relationships-with-mongoose-and-node-js-11c8)
