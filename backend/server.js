const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// API Routes
const projectsRouter = require('./routes/projects');
const testimonialsRouter = require('./routes/testimonials');
const internshipsRouter = require('./routes/internships');
const applicationsRouter = require('./routes/applications');
const uploadRouter = require('./routes/upload');
const contactRouter = require('./routes/contact');

app.use('/api/projects', projectsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/internships', internshipsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/contact', contactRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
