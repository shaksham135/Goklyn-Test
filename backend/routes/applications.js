const express = require('express');
const router = express.Router();
const Application = require('../models/application.model');
const Internship = require('../models/internship.model');
const nodemailer = require('nodemailer');

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @route   POST api/applications
// @desc    Submit a new application
// @access  Public
router.post('/', async (req, res) => {
  const { internshipId, name, email, phone, resume } = req.body;

  try {
    // Check if the internship exists and is open
    const internship = await Internship.findById(internshipId);
    if (!internship || !internship.isOpen) {
      return res.status(404).json({ msg: 'Internship not found or is no longer open' });
    }

    const newApplication = new Application({
      internship: internshipId,
      name,
      email,
      phone,
      resume
    });

    const application = await newApplication.save();

    // --- Email Notification Logic ---
    const mailOptions = {
      from: `"Goklyn Careers" <${process.env.EMAIL_USER}>`, 
      to: process.env.ADMIN_EMAIL,
      replyTo: newApplication.email, 
      subject: `New Application for ${internship.title}`,
      html: `
        <h3>New Internship Application</h3>
        <p><strong>Position:</strong> ${internship.title}</p>
        <p><strong>Applicant Name:</strong> ${newApplication.name}</p>
        <p><strong>Email:</strong> ${newApplication.email}</p>
        <p><strong>Phone:</strong> ${newApplication.phone}</p>
        <p><strong>Resume:</strong> <a href="${newApplication.resume}">View Resume</a></p>
        <p>This application was submitted on ${application.appliedAt.toDateString()}.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Notification email sent successfully.');
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Note: We don't block the user response even if the email fails.
      // The application is already saved.
    }

    res.json({ msg: 'Application submitted successfully!', application });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Internship not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
