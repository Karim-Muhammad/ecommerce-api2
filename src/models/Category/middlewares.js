// Middleware | Hooks
const slugify = require("slugify");
const CategorySchema = require("./schema");

// ========================= MIDDLEWARES for IMAGES =========================
// [`init` hook](https://mongoosejs.com/docs/api/document.html#Document.prototype.init())
CategorySchema.post("init", function (doc) {
  if (!doc.image) return;

  doc.image = `${process.env.BASE_URL}/category/${doc.image}`;
});

CategorySchema.post("save", function (doc) {
  if (!doc.image) return;

  doc.image = `${process.env.BASE_URL}/category/${doc.image}`;
});

// ========================= MIDDLEWARES for SLUG =========================
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next(); // without this, it will hang (won't save)
});

// findOneAndUpdate !== findByIdAndUpdate
CategorySchema.pre("findOneAndUpdate", function (next) {
  console.log("[FindOneAndUpdate]", this._update);

  if (this._update.name)
    this._update.slug = slugify(this._update.name, { lower: true });
  next(); // without this, it will hang (won't save)
});

// Plugin to handle error of unique
// CategorySchema.plugin(require("mongoose-unique-validator"), {
//   message: "Wrong! expected {PATH} to be unique.",
// });
