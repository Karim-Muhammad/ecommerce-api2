// ========================= CONSTANTS =========================
const DEFAULT_MAX_COUNT = 1;
const DEFAULT_FIELD_NAME = "image";

exports.DEFAULT_FIELD = {
  name: DEFAULT_FIELD_NAME,
  maxCount: DEFAULT_MAX_COUNT,
};

// ========================= FUNCTIONS =========================
/**
 * @description Prepare the fields which passed from each route to specify the fields that will be uploaded to be as multer.fields options wanted.
 * @param {*} fields The file fields in the model schema need to be uploaded.
 * @returns
 */
exports.prepareImageFields = (fields = this.DEFAULT_FIELD) =>
  Object.entries(fields).map(([name, maxCount]) => ({ name, maxCount }));
