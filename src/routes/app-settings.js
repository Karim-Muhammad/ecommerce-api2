const { Router } = require("express");

const router = Router();

const {
  getAppSettings,
  updateAppSettings,
} = require("../controllers/AppSettingsController");

module.exports = router;
