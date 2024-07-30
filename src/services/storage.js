const multer = require("multer");
const sharp = require("sharp");
const uuid = require("uuid");

const ApiError = require("../utils/ApiError");

class Storage {
  constructor() {
    this.storage_path = "src/storage";
    this.DEFAULT_SHARP_OPTIONS = {
      width: 600,
      height: 400,
      quality: 90,
      format: "jpeg",
    };
  }

  /**
   * @param {*} multer.File File object which `multer` pass to the function
   * @returns
   */
  generateFileName(file) {
    return `${file.originalname}-${uuid.v4()}-${Date.now()}`;
  }

  /**
   * @param {*} file multer.File
   * @param {*} extention Optional, if you want to pass the extention of the file (e.g. `jpg`, `png`, etc...)
   * returns filename
   */
  generateFileWithExtension(file, extention = "") {
    const ext = extention || file.mimetype.split("/")[1];

    return `${this.generateFileName(file)}.${ext}`;
  }

  /**
   * @param {*} subFolder must start with `/` (folder for categories, brands, etc...)
   * @returns
   */
  storagePath(subFolder = "") {
    return `${this.storage_path}${subFolder}`;
  }

  /**
   * @param { } subFolder specify the type of the file (e.g. `category`, `brand`, etc...) to create sub-folder for it
   * @returns
   */
  generateDiskStorage(subFolder) {
    return multer.diskStorage({
      destination: function (_req, _file, cb) {
        cb(null, `${this.storagePath(subFolder)}`);
      },

      filename: function (_req, file, cb) {
        try {
          const filename = `${subFolder}-${this.generateFileWithExtension(file)}`;
          cb(null, filename);
        } catch (er) {
          cb(er, false);
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

  /**
   * @param {*} subFolder (category, product, brand, etc...)
   * @param {*} file multer.File
   * @returns filename
   */
  async uploadFileFromMemoryTo(
    subFolder,
    file,
    options = this.DEFAULT_SHARP_OPTIONS
  ) {
    options = { ...this.DEFAULT_SHARP_OPTIONS, ...options };

    const { buffer } = file;

    const filename = this.generateFileWithExtension(file, "jpeg");

    await sharp(buffer)
      .resize({ width: options.width, height: options.height })
      .toFormat(options.format)
      .jpeg({ quality: options.quality })
      .toFile(`${this.storagePath(`/${subFolder}/${filename}`)}`);

    return filename;
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
}

module.exports = new Storage();
