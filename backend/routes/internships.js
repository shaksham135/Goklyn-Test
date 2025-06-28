const router = require('express').Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Internship = require('../models/internship.model');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'goklyn-portfolio/internships',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
    transformation: [{ width: 800, height: 400, crop: 'limit' }]
  },
});

const upload = multer({ storage });

router.get('/', (req, res) => {
  Internship.find().sort({ createdAt: -1 })
    .then(internships => res.json(internships))
    .catch(err => res.status(400).json({ msg: 'Error: ' + err }));
});

// @route   GET api/internships/:id
// @desc    Get a single internship by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ msg: 'Internship not found' });
    }
    res.json(internship);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/add', upload.single('photo'), async (req, res) => {
  try {
    const { title, description, eligibility, isOpen } = req.body;
    const newInternship = new Internship({
      title,
      description,
      eligibility,
      isOpen: isOpen !== undefined ? isOpen : true,
      photo: req.file ? req.file.path : undefined,
      photoPublicId: req.file ? req.file.filename : undefined
    });
    await newInternship.save();
    res.status(201).json({ msg: 'Internship added successfully!', internship: newInternship });
  } catch (err) {
    console.error('Error adding internship:', err);
        res.status(500).json({ msg: 'Server error while adding internship.' });
    }
});

// @route   POST api/internships/update-with-photo/:id
// @desc    Update an internship (with/without new photo) - for React admin update form
// @access  Private (should be protected)
router.post('/update-with-photo/:id', upload.single('photo'), async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ msg: 'Internship not found' });
        }

        // If a new photo is uploaded, delete the old one from Cloudinary and update fields
        if (req.file) {
            if (internship.photoPublicId) {
                await cloudinary.uploader.destroy(internship.photoPublicId);
            }
            internship.photo = req.file.path;
            internship.photoPublicId = req.file.filename;
        }

        // Update other fields
        const { title, description, eligibility, isOpen } = req.body;
        internship.title = title || internship.title;
        internship.description = description || internship.description;
        internship.eligibility = eligibility || internship.eligibility;
        if (isOpen !== undefined) {
            internship.isOpen = isOpen;
        }

        await internship.save();
        res.json({ msg: 'Internship updated successfully', internship });

    } catch (err) {
        console.error('Error updating internship:', err);
        res.status(500).json({ msg: 'Server error while updating internship.' });
    }
});

// @route   POST api/internships/update/:id
// @desc    Update an internship
// @access  Private (should be protected)
router.post('/update/:id', upload.single('photo'), async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ msg: 'Internship not found' });
        }

        // If a new photo is uploaded, delete the old one from Cloudinary and update fields
        if (req.file) {
            if (internship.photoPublicId) {
                await cloudinary.uploader.destroy(internship.photoPublicId);
            }
            internship.photo = req.file.path;
            internship.photoPublicId = req.file.filename;
        }

        // Update other fields
        const { title, description, eligibility, isOpen } = req.body;
        internship.title = title || internship.title;
        internship.description = description || internship.description;
        internship.eligibility = eligibility || internship.eligibility;
        if (isOpen !== undefined) {
            internship.isOpen = isOpen;
        }

        await internship.save();
        res.json({ msg: 'Internship updated successfully', internship });

    } catch (err) {
        console.error('Error updating internship:', err);
        res.status(500).json({ msg: 'Server error while updating internship.' });
    }
});

// @route   DELETE api/internships/:id
// @desc    Delete an internship
// @access  Private (should be protected)
router.delete('/:id', async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ msg: 'Internship not found' });
        }

        // If there's a photo, delete it from Cloudinary
        if (internship.photoPublicId) {
            await cloudinary.uploader.destroy(internship.photoPublicId);
        }

        await Internship.findByIdAndDelete(req.params.id);
        
        res.json({ msg: 'Internship deleted successfully.' });

    } catch (err) {
        console.error('Error deleting internship:', err);
        res.status(500).json({ msg: 'Server error while deleting internship.' });
    }
});

module.exports = router;
