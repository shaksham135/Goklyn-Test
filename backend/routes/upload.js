const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: './uploads/resumes/',
    filename: function(req, file, cb){
        // Create a unique filename to avoid conflicts: fieldname-timestamp.extension
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // Limit file size to 2MB
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('resume'); // 'resume' is the name of the form field

// Check File Type function
function checkFileType(file, cb){
    // Allowed extensions
    const filetypes = /pdf/;
    // Check the extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check the mime type
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}

// @route   POST api/upload/resume
// @desc    Upload a resume
// @access  Public
router.post('/resume', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.status(400).json({ msg: err });
        } else {
            if(req.file == undefined){
                res.status(400).json({ msg: 'Error: No File Selected!' });
            } else {
                res.status(200).json({
                    msg: 'File Uploaded Successfully!',
                    filePath: `/uploads/resumes/${req.file.filename}`
                });
            }
        }
    });
});

module.exports = router;
