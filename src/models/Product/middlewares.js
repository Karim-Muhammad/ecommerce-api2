const slugify = require("slugify");
const ProductSchema = require("./schema");

// ========================= MIDDLEWARES for IMAGES =========================
// find* these returns document from db, so it trigger init hook.
// create will not.
ProductSchema.post("init", (doc) => {
  if (!doc.imageCover) return;

  doc.imageCover = `${process.env.BASE_URL}/product/${doc.imageCover}`;
});

ProductSchema.post("save", (doc) => {
  if (!doc.imageCover) return;

  doc.imageCover = `${process.env.BASE_URL}/product/${doc.imageCover}`;
});

// ========================= MIDDLEWARES for SLUG =========================
ProductSchema.pre("save", function (next) {
  console.log("PRE MIDDLEWARE SAVE", this);

  this.slug = slugify(this.name, { lower: true });

  next();
});

ProductSchema.pre("findOneAndUpdate", function (next) {
  console.log("PRE MIDDLEWARE", this._update);
  if (this._update.name)
    this._update.slug = slugify(this._update.name, { lower: true });

  // if you didn't send slug at all in body of request, you cannot add it here, because _update is immutable
  // you cannot add new property to it, you can only modify the existing properties
  // so you have to at least add slug even if it is empty.

  // so that we have to add slug to body of request
  // {...req.body, slug: ""}
  next();
});

// ========================= MIDDLEWARES for POPULATE =========================
// Middleware pre any method that starts with `find`
ProductSchema.pre(/^find/g, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });

  next();
});
