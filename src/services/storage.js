const multer = require("multer");
const uuid = require("uuid");
const ApiError = require("../utils/ApiError");
const sharp = require("sharp");

class Storage {
  constructor() {
    this.storage_path = "src/storage";
  }

  /**
   * @param {*} multer.File File object which `multer` pass to the function
   * @returns
   */
  generateFileName(file) {
    return `${uuid.v4()}-${file.originalname}-${Date.now()}`;
  }

  /**
   * @param {*} file multer.File
   * @param {*} extention Optional, if you want to pass the extention of the file (e.g. `jpg`, `png`, etc...)
   * returns filename
   */
  generateFileWithExtension(file, extention = "") {
    const ext = extention ? extention : file.mimetype.split("/")[1];

    return `${this.generateFileName(file)}.${ext}`;
  }

  /**
   * @param {*} suffix must start with `/` (folder for categories, brands, etc...)
   * @returns
   */
  storagePath(suffix = "") {
    return `${this.storage_path}` + suffix;
  }

  /**
   * @param { } sub_folder specify the type of the file (e.g. `category`, `brand`, etc...) to create sub-folder for it
   * @returns
   */
  generateDiskStorage(sub_folder) {
    return multer.diskStorage({
      destination: function (_req, _file, cb) {
        cb(null, `${this.storagePath(sub_folder)}`);
      },

      filename: function (_req, file, cb) {
        console.log(file);
        try {
          const filename = `${sub_folder}-${this.generateFileWithExtension(file)}`;
          cb(null, filename);
        } catch (er) {
          cb(er);
        }
      },
    });
  }

  /**
   * @returns multer.memoryStorage
   */
  generateMemoryStorage() {
    return multer.memoryStorage();
  }

  filterByMimeType(mimetype) {
    return (_req, file, cb) => {
      if (file.mimetype.startsWith(mimetype)) {
        cb(null, true);
      } else {
        cb(ApiError.badRequest("Invalid file type"), false);
      }
    };
  }

  /**
   * @param {*} storage
   * @returns
   */
  uploadMiddleware(storage) {
    return multer({
      storage: storage,
      fileFilter: this.filterByMimeType("image"),
    });
  }

  /**
   * @param {*} sub_folder (category, product, brand, etc...)
   * @param {*} file multer.File
   * @returns filename
   */
  async uploadFileFromMemoryTo(sub_folder, file) {
    const buffer = file.buffer;
    const filename = this.generateFileWithExtension(file, "jpeg");

    await sharp(buffer)
      .resize({ width: 600, height: 400 })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${this.storagePath(`/${sub_folder}`)}/${filename}`);

    return filename;
  }
}

exports.Storage = Storage;
