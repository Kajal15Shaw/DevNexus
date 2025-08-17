// routes/api/avatar.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const User = require('../../models/User');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('avatar');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

// @route   POST api/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ msg: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ msg: 'No file selected!' });
      } else {
        const avatarUrl = `/uploads/${req.file.filename}`;
        try {
          const user = await User.findById(req.user.id);
          user.avatar = avatarUrl;
          await user.save();
          res.json({ msg: 'File uploaded!', file: avatarUrl });
        } catch (error) {
          console.error(error.message);
          res.status(500).send('Server Error');
        }
      }
    }
  });
});

module.exports = router;