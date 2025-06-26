const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const router = express.Router();

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: PDFs Only!');
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('resume');

router.post('/resume', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'Error: No File Selected!' });
    }
    try {
      // Debug: log file details
      console.log('Received file:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      console.log('Buffer length:', req.file.buffer.length);
      // Check PDF signature before uploading
      const pdfSignature = req.file.buffer.slice(0, 4).toString();
            if (pdfSignature !== '%PDF') {
                return res.status(400).json({ msg: 'Uploaded file is not a valid PDF.' });
            }

            // Upload PDF buffer to Cloudinary
            let cld_upload_stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw', // 'raw' for non-image files like PDFs
                    folder: 'goklyn-portfolio/resumes',
                    public_id: path.parse(req.file.originalname).name + '-' + Date.now() + '.pdf'
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return res.status(500).json({ msg: 'Cloudinary upload error', error });
                    }
                    // Debug: log Cloudinary result
                    console.log('Cloudinary upload result:', result);
                    // Return the Cloudinary URL
                    return res.status(200).json({
                        msg: 'File Uploaded Successfully!',
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
        } catch (e) {
            return res.status(500).json({ msg: 'Server error uploading file', error: e.message });
        }
    });
});

module.exports = router;
