const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const Internship = require('../models/internship.model');

// Set up storage engine for Multer for internship images
const storage = multer.diskStorage({
    destination: './uploads/internships/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable for internship images
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Limit file size to 5MB
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('photo');

// Check File Type function for images
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// @route   GET api/internships
// @desc    Get all open internships
// @access  Public
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find({ isOpen: true }).sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/internships
// @desc    Create a new internship
// @access  Private (Admin)
router.post('/', async (req, res) => {
  const { title, description, eligibility } = req.body;

  try {
    const newInternship = new Internship({
      title,
      description,
      eligibility
    });

    const internship = await newInternship.save();
    res.json(internship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/internships/add-with-photo
// @desc    Create a new internship with a photo
// @access  Private (Admin)
router.post('/add-with-photo', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }

        const { title, description, eligibility } = req.body;

        if (!req.file) {
            // Handle case where no photo is uploaded
            try {
                const newInternship = new Internship({ title, description, eligibility });
                const internship = await newInternship.save();
                return res.json(internship);
            } catch (dbErr) {
                console.error(dbErr.message);
                return res.status(500).send('Server Error');
            }
        }

        // Handle case with photo upload
        const { filename } = req.file;
        const originalPath = req.file.path;
        const processedFilename = `processed-${filename}`;
        const processedPath = path.join('uploads', 'internships', processedFilename);

        try {
            await sharp(originalPath)
                .resize(800, 400, {
                    fit: sharp.fit.cover,
                    position: 'entropy'
                })
                .toFile(processedPath);

            fs.unlinkSync(originalPath);

            const photo = `/uploads/internships/${processedFilename}`;

            const newInternship = new Internship({
                title,
                description,
                eligibility,
                photo
            });

            const internship = await newInternship.save();
            res.json(internship);

        } catch (procErr) {
            console.error('Image processing error:', procErr);
            if (fs.existsSync(originalPath)) {
                fs.unlinkSync(originalPath);
            }
            res.status(500).json({ msg: 'Error processing image.' });
        }
    });
});

// @route   DELETE api/internships/:id
// @desc    Delete an internship
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ msg: 'Internship not found' });
        }

        // If the internship has a photo, delete it
        if (internship.photo) {
            const photoPath = path.join(__dirname, '..', internship.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        await Internship.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Internship deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/internships/update-with-photo/:id
// @desc    Update an internship with a photo
// @access  Private (Admin)
router.post('/update-with-photo/:id', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }

        try {
            const internship = await Internship.findById(req.params.id);
            if (!internship) {
                return res.status(404).json({ msg: 'Internship not found' });
            }

            const { title, description, eligibility, isOpen } = req.body;

            internship.title = title || internship.title;
            internship.description = description || internship.description;
            internship.eligibility = eligibility || internship.eligibility;
            if (isOpen !== undefined) {
                internship.isOpen = isOpen;
            }

            if (req.file) {
                const { filename } = req.file;
                const originalPath = req.file.path;
                const processedFilename = `processed-${filename}`;
                const processedPath = path.join('uploads', 'internships', processedFilename);

                await sharp(originalPath)
                    .resize(800, 400, { fit: sharp.fit.cover, position: 'entropy' })
                    .toFile(processedPath);

                fs.unlinkSync(originalPath);

                if (internship.photo) {
                    const oldPhotoPath = path.join(__dirname, '..', internship.photo);
                    if (fs.existsSync(oldPhotoPath)) {
                        fs.unlinkSync(oldPhotoPath);
                    }
                }

                internship.photo = `/uploads/internships/${processedFilename}`;
            }

            const updatedInternship = await internship.save();
            res.json(updatedInternship);

        } catch (procErr) {
            console.error('Update error:', procErr);
            res.status(500).json({ msg: 'Error updating internship.' });
        }
    });
});

// @route   GET api/internships/:id
// @desc    Get a single internship by ID
// @access  Public (or Private for admin)
router.get('/:id', async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ msg: 'Internship not found' });
        }
        res.json(internship);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Internship not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
