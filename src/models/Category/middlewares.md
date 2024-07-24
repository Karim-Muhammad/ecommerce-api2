```js
const slugify = require("slugify");
const CategorySchema = require("./schema");

// Middleware | Hooks
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next(); // without this, it will hang (won't save)
});

// findOneAndUpdate !== findByIdAndUpdate
// CategorySchema.post(
//   "findOneAndUpdate",
//   { document: true, query: true }, // read more [here](https://mongoosejs.com/docs/middleware.html#types-of-middleware)
//   (doc, next) => {
//     // console.log("QUERY ", this);
//     // console.log("DOCUMENT ", doc);
//     doc.slug = slugify(doc.name, { lower: true });
//     doc.save();
// this was cause problem when we update model doesn't has required field
// because `save()`, `validate()` is doing validation against model, throw error.
//     next();
//   }
// );

/**
 * Some Weird Error Occurs
 * After Model is updated with missing required field!
 * it throw an error
 */
CategorySchema.post("validate", (error, doc, next) => {
  if (error) {
    console.log("FUCK What Happening!");
    error.status = 400;
    return next(error);
  }

  next();
});

// Plugin to handle error of unique
// CategorySchema.plugin(require("mongoose-unique-validator"), {
//   message: "Wrong! expected {PATH} to be unique.",
// });
```
