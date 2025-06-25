const router = require('express').Router();
let Testimonial = require('../models/testimonial.model');

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

module.exports = router;
