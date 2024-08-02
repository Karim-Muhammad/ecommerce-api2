const bcrypt = require("bcryptjs");

const { default: slugify } = require("slugify");

const UserSchema = require("./schema");

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // [useless] if password is not modified, skip this middleware because password user hashed while incoming password is un-hashed

  this.slug = slugify(this.username, { lower: true });
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  //   console.log("UPDATE USER", this._update);

  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 12);
    this._update.passwordChangedAt = Date.now();
  }

  if (this._update.username) {
    this._update.slug = slugify(this._update.username, { lower: true });
  }

  next();
});
