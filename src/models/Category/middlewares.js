const slugify = require("slugify");
const CategorySchema = require("./schema");

// Middleware | Hooks
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next(); // without this, it will hang (won't save)
});

// findOneAndUpdate !== findByIdAndUpdate
CategorySchema.post(
  "findOneAndUpdate",
  { document: true, query: true },
  function (doc, next) {
    console.log("Pre Middleware");
    // console.log("QUERY ", this);
    // console.log("DOCUMENT ", doc);
    doc.slug = slugify(doc.name, { lower: true });
    doc.save();
    next();
  }
);

CategorySchema.post("save", function (doc, next) {
  console.log("Category has been saved", doc);
  next();
});

// Plugin to handle error of unique
// CategorySchema.plugin(require("mongoose-unique-validator"), {
//   message: "Wrong! expected {PATH} to be unique.",
// });
