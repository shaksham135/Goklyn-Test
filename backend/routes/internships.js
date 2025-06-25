const express = require('express');
const router = express.Router();
const Internship = require('../models/internship.model');

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

module.exports = router;
