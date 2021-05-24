require('dotenv').config()
const multer = require('multer')
const path = require('path')
const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted

    // To reject this file pass `false`, like so:
    cb(null, false)
    if (file.mimetype.includes('image')) {
      cb(null, true)
    }
    // To accept the file pass `true`, like so:

    // You can always pass an error if something goes wrong:
    cb(new Error("I don't have a clue!"))
  },
})
module.exports = uploadAvatar
