Big Error Annoy me

CREATE YOUR FOLDER WHICH YOU WILL UPLOAD YOUR FILES TO BEFORE YOU RUN THE SERVER

### There are 2 Types for Multer Storage

1. Memory Storage: it store the file which you send in your request in the memory and it will be deleted after the request is done, and map this file to the `request.file` object (not stored in your disk).
2. Disk Storage Engine: it store the file which you send in your request automatically without any manipulation into your disk, and map this file to the `request.file` object.

### Image Processing

when we want to manipulate our image before saving it in our disk, **Storage Disk** not good option for that, because it will store the image directly without any manipulation, so we need to use **Memory Storage** to manipulate the image before saving it in our disk.

because **Memory Storage** it just save file in the memory not disk, so we can manipulate it and then save it in any place i want (disk, cloud, etc...)

### Other options

we can use other solutions to prevent consume our server memory, because the user can upload tens of images with HD quality and you want to store then in memory and that will consume your server memory, so we can use like **Multer GridFS Storage** which store the file in the database, or **Multer S3 Storage** which store the file in the Amazon S3.

or use microservices we create (separate servers for file upload and download) to prevent consume our server memory.

or use third party services like Cloudinary, Firebase, etc...

### Multer Configuration

```javascript
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
```
