const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
let Testimonial = require('../models/testimonial.model');

// Set up storage engine for Multer for testimonials
const storage = multer.diskStorage({
    destination: './uploads/testimonials/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable for testimonials
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // Limit file size to 2MB
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('photo'); // 'photo' is the name of the form field

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

// Get all APPROVED testimonials (for public display)
router.route('/').get((req, res) => {
    Testimonial.find({ approved: true })
        .then(testimonials => res.json(testimonials))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get ALL testimonials (for admin view)
router.route('/all').get((req, res) => {
    Testimonial.find()
        .then(testimonials => res.json(testimonials))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new testimonial with photo (for admin)
router.post('/add-with-photo', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }
        if (req.file === undefined) {
            return res.status(400).json({ msg: 'Error: No File Selected!' });
        }

        const { filename } = req.file;
        const originalPath = req.file.path;
        const processedFilename = `processed-${filename}`;
        const processedPath = path.join('uploads', 'testimonials', processedFilename);

        try {
            await sharp(originalPath)
                .resize(300, 300, {
                    fit: sharp.fit.cover,
                    position: sharp.strategy.attention
                })
                .toFile(processedPath);

            // Remove the original large file
            fs.unlinkSync(originalPath);

            const { clientName, company, feedback, rating } = req.body;
            const photo = `/uploads/testimonials/${processedFilename}`;

            const newTestimonial = new Testimonial({
                clientName,
                company,
                feedback,
                rating,
                photo,
                approved: true
            });

            await newTestimonial.save();
            res.json('Testimonial added successfully!');

        } catch (procErr) {
            console.error('Image processing error:', procErr);
            // Attempt to clean up the original file if processing fails
            if (fs.existsSync(originalPath)) {
                fs.unlinkSync(originalPath);
            }
            res.status(500).json({ msg: 'Error processing image.' });
        }
    });
});


// Add a new testimonial (client submission)
router.route('/add').post((req, res) => {
    const { clientName, company, feedback, rating } = req.body;
    const newTestimonial = new Testimonial({ clientName, company, feedback, rating });

    newTestimonial.save()
        .then(() => res.json('Testimonial submitted for approval!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Approve a testimonial
router.route('/approve/:id').post((req, res) => {
    Testimonial.findById(req.params.id)
        .then(testimonial => {
            testimonial.approved = true;
            testimonial.save()
                .then(() => res.json('Testimonial approved!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a testimonial
router.route('/:id').delete((req, res) => {
    Testimonial.findByIdAndDelete(req.params.id)
        .then(() => res.json('Testimonial deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// @route   DELETE api/testimonials/:id
// @desc    Delete a testimonial
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ msg: 'Testimonial not found' });
        }

        // If the testimonial has a photo, delete it from the server
        if (testimonial.photo) {
            const photoPath = path.join(__dirname, '..', testimonial.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Testimonial deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/testimonials/update-with-photo/:id
// @desc    Update a testimonial with a photo
// @access  Private (Admin)
router.post('/update-with-photo/:id', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }

        try {
            const testimonial = await Testimonial.findById(req.params.id);
            if (!testimonial) {
                return res.status(404).json({ msg: 'Testimonial not found' });
            }

            const { name, quote, company } = req.body;

            testimonial.name = name || testimonial.name;
            testimonial.quote = quote || testimonial.quote;
            testimonial.company = company || testimonial.company;

            if (req.file) {
                const { filename } = req.file;
                const originalPath = req.file.path;
                const processedFilename = `processed-${filename}`;
                const processedPath = path.join('uploads', 'testimonials', processedFilename);

                await sharp(originalPath)
                    .resize(200, 200, { fit: sharp.fit.cover, position: 'entropy' })
                    .toFile(processedPath);

                fs.unlinkSync(originalPath);

                if (testimonial.photo) {
                    const oldPhotoPath = path.join(__dirname, '..', testimonial.photo);
                    if (fs.existsSync(oldPhotoPath)) {
                        fs.unlinkSync(oldPhotoPath);
                    }
                }

                testimonial.photo = `/uploads/testimonials/${processedFilename}`;
            }

            const updatedTestimonial = await testimonial.save();
            res.json(updatedTestimonial);

        } catch (procErr) {
            console.error('Update error:', procErr);
            res.status(500).json({ msg: 'Error updating testimonial.' });
        }
    });
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
