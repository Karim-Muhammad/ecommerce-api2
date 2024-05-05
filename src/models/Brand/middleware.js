const { default: slugify } = require("slugify");
const BrandSchema = require("./schema");

BrandSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

BrandSchema.post(
  "findOneAndUpdate",
  { document: true, query: true },
  (doc, next) => {
    doc.slug = slugify(doc.name, { lower: true });
    doc.save();
    next();
  }
);
