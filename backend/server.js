const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// CORS Configuration for Production
const allowedOrigins = [
    'http://localhost:3000', // For local development
    'https://goklyn-test.netlify.app' // Deployed frontend URL
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

app.use(cors(corsOptions)); // Use configured CORS
app.use(express.json());



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
