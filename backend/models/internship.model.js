const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;
