const { default: slugify } = require("slugify");
const BrandSchema = require("./schema");
const config = require("../../../config");

BrandSchema.post("init", (doc) => {
  if (!doc.image) return;

  doc.image = `${config.base_url}/storage/brand/${doc.image}`;
});

BrandSchema.post("save", (doc) => {
  if (!doc.image) return;

  doc.image = `${config.base_url}/storage/brand/${doc.image}`;
});

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
