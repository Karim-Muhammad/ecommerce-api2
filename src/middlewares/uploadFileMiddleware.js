const { Storage } = require("../services/storage");

const storage = new Storage();

const diskStorage = storage.generateMemoryStorage();
const upload = storage.uploadMiddleware(diskStorage);

exports.uploadFileMiddleware = (model, field) => [
  upload.single(field),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a file",
      });
    }

    const filename = await storage.uploadFileFromMemoryTo(model, req.file);

    req.body[field] = filename;

    next();
  },
];
