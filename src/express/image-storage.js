'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {generateId} = require(`../utils`);

const UPLOAD_DIR = `./upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const imageStorage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqName = generateId();
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqName}.${extension}`);
  }
});

module.exports = imageStorage;
