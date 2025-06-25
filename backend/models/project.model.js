const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    projectUrl: {
        type: String
    },
    tags: [{
        type: String,
        trim: true
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
