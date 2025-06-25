const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  const { fullname, emailaddress, phone, msg } = req.body;

  // Basic validation
  if (!fullname || !emailaddress || !msg) {
    return res.status(400).json({ message: 'Name, Email, and Message are required.' });
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email from .env
      pass: process.env.EMAIL_PASS, // Your email password or app password from .env
    },
  });

  // Set up email data
  const mailOptions = {
    from: `"${fullname}" <${emailaddress}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to the admin's email address
    subject: 'New Contact Form Submission from Portfolio',
    html: `
      <h2>New Message from your Portfolio Contact Form</h2>
      <p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${emailaddress}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${msg}</p>
    `,
  };

  try {
    // Send mail
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
