const bcrypt = require("bcryptjs");

const { default: slugify } = require("slugify");

const UserSchema = require("./schema");

UserSchema.pre("save", async function (next) {
  console.log("SAVE USER");

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now() - 1000; // - 1000 to avoid token creation before password change
  }

  if (this.isModified("username"))
    this.slug = slugify(this.username, { lower: true });

  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  console.log("UPDATE USER");

  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 12);
    this._update.passwordChangedAt = Date.now(); // no -1000 because we are not creating token
  }

  if (this._update.username) {
    this._update.slug = slugify(this._update.username, { lower: true });
  }

  next();
});
