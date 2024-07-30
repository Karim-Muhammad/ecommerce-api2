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
exports.uploadFileMiddleware = (model, fields, options = {}) => {
  fields = prepareImageFields(fields);

  console.log("Fields", fields);

  const prepareUploadMiddleware = upload.fields(fields);

  return [
    prepareUploadMiddleware,
    async (req, res, next) => {
      try {
        const fieldNames = Object.keys(req.files); // image, imageCover, etc...

        console.log("Field names", fieldNames);

        if (!fieldNames.length) {
          console.log("No files uploaded.");
          throw new Error("No files uploaded.");
        }

        // Loop through only the fields that i registered in route, not all images uploaded.
        const fieldsUploadPromises = fields.map(async ({ name: fieldName }) => {
          const field = req.files[fieldName];

          if (!field) return;

          const filePromises = field?.map(async (file) => {
            options = options[fieldName] || {};

            const filename = await storage.uploadFileFromMemoryTo(
              model,
              file,
              options
            );

            return filename;
          });

          const filenames = await Promise.all(filePromises);

          req.body[fieldName] =
            filenames.length === 1 ? filenames.join("") : filenames;
        });

        await Promise.all(fieldsUploadPromises);
        return next();
      } catch (error) {
        // next(error); // validate image early [OK]
        return next(); // [OK]
      }
    },
  ];
};
