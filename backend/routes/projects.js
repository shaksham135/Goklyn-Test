const router = require('express').Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Project = require('../models/project.model');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'goklyn-portfolio/projects',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  },
});

const upload = multer({ storage });

// --- API ROUTES ---

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.route('/').get((req, res) => {
    Project.find().sort({ createdAt: -1 })
        .then(projects => res.json(projects))
        .catch(err => res.status(400).json({ msg: 'Error: ' + err }));
});

// @route   GET api/projects/:id
// @desc    Get a single project by ID
// @access  Public
router.route('/:id').get((req, res) => {
    Project.findById(req.params.id)
        .then(project => res.json(project))
        .catch(err => res.status(400).json({ msg: 'Error: ' + err }));
});

// @route   POST api/projects/add
// @desc    Add a new project
// @access  Private (should be protected)
router.post('/add', upload.fields([{ name: 'photo', maxCount: 1 }]), async (req, res) => {
    console.log('Received body (add):', req.body);
    console.log('Received file (add):', req.files);
    try {
        const { title, description, projectUrl, githubUrl, tags } = req.body;

        const projectData = {
            title,
            description,
            projectUrl: projectUrl || '',
            githubUrl: githubUrl || '',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        };

        if (req.files && req.files.photo && req.files.photo[0]) {
            projectData.photo = req.files.photo[0].path;
            projectData.photoPublicId = req.files.photo[0].filename;
        }
        
        const newProject = new Project(projectData);

        await newProject.save();
        res.status(201).json({ msg: 'Project added successfully!', project: newProject });

    } catch (err) {
        console.error('Error adding project:', err);
        res.status(500).json({ msg: 'Server error while adding project.' });
    }
});

// @route   POST api/projects/update/:id
// @desc    Update a project
// @access  Private (should be protected)
router.post('/update/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), async (req, res) => {
    console.log('Received body (update):', req.body);
    console.log('Received file (update):', req.files);
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // If a new photo is uploaded, delete the old one from Cloudinary and update
        if (req.files && req.files.photo && req.files.photo[0]) {
            if (project.photoPublicId) {
                await cloudinary.uploader.destroy(project.photoPublicId);
            }
            project.photo = req.files.photo[0].path;
            project.photoPublicId = req.files.photo[0].filename;
        }

        // Update other project fields
        const { title, description, projectUrl, githubUrl, tags } = req.body;
        project.title = title || project.title;
        project.description = description || project.description;
        project.projectUrl = typeof projectUrl !== 'undefined' ? projectUrl : project.projectUrl;
        project.githubUrl = typeof githubUrl !== 'undefined' ? githubUrl : project.githubUrl;
        if (tags) {
            project.tags = tags.split(',').map(tag => tag.trim());
        }

        await project.save();
        res.json({ msg: 'Project updated successfully', project });

    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ msg: 'Server error while updating project.' });
    }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private (should be protected)
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // If the project has a photo, delete it from Cloudinary
        if (project.photoPublicId) {
            await cloudinary.uploader.destroy(project.photoPublicId);
        }

        await Project.findByIdAndDelete(req.params.id);
        
        res.json({ msg: 'Project deleted successfully.' });

    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ msg: 'Server error while deleting project.' });
    }
});

module.exports = router;
