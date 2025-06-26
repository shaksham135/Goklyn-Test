const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
let Project = require('../models/project.model');

// Set up storage engine for Multer for project images
const storage = multer.diskStorage({
    destination: './uploads/projects/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable for project images
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Limit file size to 5MB
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('photo');

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

// Get all projects
router.route('/').get((req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new project with photo (for admin)
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
        const processedPath = path.join('uploads', 'projects', processedFilename);

        try {
            await sharp(originalPath)
                .resize(800, 600, {
                    fit: sharp.fit.cover,
                    position: 'entropy'
                })
                .toFile(processedPath);

            fs.unlinkSync(originalPath);

            const { title, description, projectUrl, tags } = req.body;
            const photo = `/uploads/projects/${processedFilename}`;

            const newProject = new Project({
                title,
                description,
                projectUrl,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                photo
            });

            await newProject.save();
            res.json('Project added successfully!');

        } catch (procErr) {
            console.error('Image processing error:', procErr);
            if (fs.existsSync(originalPath)) {
                fs.unlinkSync(originalPath);
            }
            res.status(500).json({ msg: 'Error processing image.' });
        }
    });
});

// Get a single project by ID
router.route('/:id').get((req, res) => {
    Project.findById(req.params.id)
        .then(project => res.json(project))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Update a project with photo
router.post('/update-with-photo/:id', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }

        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ msg: 'Project not found' });
            }

            const { title, description, projectUrl, tags } = req.body;

            project.title = title || project.title;
            project.description = description || project.description;
            project.projectUrl = projectUrl || project.projectUrl;
            project.tags = tags ? tags.split(',').map(tag => tag.trim()) : project.tags;

            if (req.file) {
                // If a new photo is uploaded, process it and delete the old one
                const { filename } = req.file;
                const originalPath = req.file.path;
                const processedFilename = `processed-${filename}`;
                const processedPath = path.join('uploads', 'projects', processedFilename);

                await sharp(originalPath)
                    .resize(800, 600, { fit: sharp.fit.cover, position: 'entropy' })
                    .toFile(processedPath);

                fs.unlinkSync(originalPath); // Delete original upload

                // Delete old photo if it exists
                if (project.photo) {
                    const oldPhotoPath = path.join(__dirname, '..', project.photo);
                    if (fs.existsSync(oldPhotoPath)) {
                        fs.unlinkSync(oldPhotoPath);
                    }
                }

                project.photo = `/uploads/projects/${processedFilename}`;
            }

            await project.save();
            res.json({ msg: 'Project updated successfully', project });

        } catch (procErr) {
            console.error('Update error:', procErr);
            res.status(500).json({ msg: 'Error updating project.' });
        }
    });
});

// Legacy update route (can be removed if not used elsewhere)
router.route('/update/:id').post((req, res) => {
    Project.findById(req.params.id)
        .then(project => {
            project.title = req.body.title;
            project.description = req.body.description;
            project.photo = req.body.photo; // Note: photo updates would need a separate upload logic
            project.projectUrl = req.body.projectUrl;
            project.tags = req.body.tags;

            project.save()
                .then(() => res.json('Project updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a project
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // If the project has a photo, delete it from the filesystem
        if (project.photo) {
            const photoPath = path.join(__dirname, '..', project.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Project deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
