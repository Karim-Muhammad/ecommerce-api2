const { default: slugify } = require("slugify");
const SubCategorySchema = require("./schema");

SubCategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// see Category model middleware and learn how to applied!
SubCategorySchema.pre("findOneAndUpdate", function (next) {
  // before update, all your updates will be stored in this._update
  // then mongoose will apply these updates to the document
  // but we modify it before it's applied
  this._update.slug = slugify(this._update.name, { lower: true });
  next();
});

// SubCategorySchema.pre(
//   "updateOne",
//   {
//     // document: true,
//     query: true,
//   },
//   function (next, doc) {
//     console.log("DOC: ", doc);
//     console.log("QUERY: ", this);
//     this.slug = slugify(this.name, { lower: true });
//     next();
//   }
// );

module.exports = SubCategorySchema;
