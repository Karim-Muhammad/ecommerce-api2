const storage = require("../services/storage");

const { prepareImageFields } = require("../helpers/upload-images");

const memoryStorage = storage.generateMemoryStorage();

const upload = storage.uploadMiddleware(memoryStorage);

/**
 * @description Upload file middleware to upload file and save it in req.body.
 * @param {*} model /subFolder The model name that need to upload file to (category, product, brand, etc...).
 * @param {*} fields The fields that model has in its schema and need to be uploaded to.
 * @returns
 */
exports.uploadFileMiddleware = (model, fields) => {
  fields = prepareImageFields(fields);

  const prepareUploadMiddleware = upload.fields(fields);

  return [
    prepareUploadMiddleware,
    async (req, res, next) => {
      try {
        const fieldNames = Object.keys(req.files); // image, coverImage, etc...

        console.log("FILES", req.files);

        if (!fieldNames.length) {
          throw new Error("No files uploaded.");
        }

        // Loop through only the fields that i registered in route, not all images uploaded.
        fields.forEach(async ({ name: fieldName }) => {
          const field = req.files[fieldName];

          const filePromises = field.map(async (file) => {
            const filename = await storage.uploadFileFromMemoryTo(model, file);

            return filename;
          });

          req.body[fieldName] = await Promise.all(filePromises);
          req.body[fieldName] =
            req.body[fieldName].length === 1
              ? req.body[fieldName][0]
              : req.body[fieldName];

          next();
        });
      } catch (error) {
        // next(error); // validate image early [OK]
        next(); // [OK]
      }
    },
  ];
};
