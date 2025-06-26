const router = require('express').Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
let Testimonial = require('../models/testimonial.model');

// Configure Cloudinary storage for testimonial images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'goklyn-portfolio/testimonials',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }]
  },
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage: storage });

// --- API ROUTES ---

// @route   GET api/testimonials
// @desc    Get all approved testimonials
// @access  Public
router.route('/').get((req, res) => {
    Testimonial.find({ approved: true }).sort({ createdAt: -1 })
        .then(testimonials => res.json(testimonials))
        .catch(err => res.status(400).json({ msg: 'Error: ' + err }));
});

// @route   GET api/testimonials/all
// @desc    Get all testimonials (for admin)
// @access  Private (should be protected)
router.route('/all').get((req, res) => {
    Testimonial.find().sort({ createdAt: -1 })
        .then(testimonials => res.json(testimonials))
        .catch(err => res.status(400).json({ msg: 'Error: ' + err }));
});

// @route   POST api/testimonials/add
// @desc    Add a new testimonial
// @access  Private (should be protected)
router.post('/add', upload.single('photo'), async (req, res) => {
    try {
        const { clientName, company, feedback, rating, approved } = req.body;
        
        const newTestimonial = new Testimonial({
            clientName,
            company,
            feedback,
            rating,
            approved: approved !== undefined ? approved : true, // Default to approved for admin adds
            photo: req.file ? req.file.path : undefined,
            photoPublicId: req.file ? req.file.filename : undefined
        });

        await newTestimonial.save();
        res.status(201).json({ msg: 'Testimonial added successfully!', testimonial: newTestimonial });

    } catch (err) {
        console.error('Error adding testimonial:', err);
        res.status(500).json({ msg: 'Server error while adding testimonial.' });
    }
});

// @route   POST api/testimonials/update/:id
// @desc    Update a testimonial
// @access  Private (should be protected)
router.post('/update/:id', upload.single('photo'), async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ msg: 'Testimonial not found' });
        }

        if (req.file) {
            if (testimonial.photoPublicId) {
                await cloudinary.uploader.destroy(testimonial.photoPublicId);
            }
            testimonial.photo = req.file.path;
            testimonial.photoPublicId = req.file.filename;
        }

        const { clientName, company, feedback, rating, approved } = req.body;
        testimonial.clientName = clientName || testimonial.clientName;
        testimonial.company = company || testimonial.company;
        testimonial.feedback = feedback || testimonial.feedback;
        if (rating) testimonial.rating = rating;
        if (approved !== undefined) testimonial.approved = approved;

        await testimonial.save();
        res.json({ msg: 'Testimonial updated successfully', testimonial });

    } catch (err) {
        console.error('Error updating testimonial:', err);
        res.status(500).json({ msg: 'Server error while updating testimonial.' });
    }
});

// @route   DELETE api/testimonials/:id
// @desc    Delete a testimonial
// @access  Private (should be protected)
router.delete('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ msg: 'Testimonial not found' });
        }

        if (testimonial.photoPublicId) {
            await cloudinary.uploader.destroy(testimonial.photoPublicId);
        }

        await Testimonial.findByIdAndDelete(req.params.id);
        
        res.json({ msg: 'Testimonial deleted successfully.' });

    } catch (err) {
        console.error('Error deleting testimonial:', err);
        res.status(500).json({ msg: 'Server error while deleting testimonial.' });
    }
});

// @route   GET api/testimonials/:id
// @desc    Get a single testimonial by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ msg: 'Testimonial not found' });
        }
        res.json(testimonial);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Testimonial not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
