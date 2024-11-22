const { default: mongoose } = require("mongoose");
const AppSettingsSchema = require("./schema");

const AppSettings = mongoose.model("AppSettings", AppSettingsSchema);

module.exports = AppSettings;
