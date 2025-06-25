const router = require('express').Router();
let Project = require('../models/project.model');

// Get all projects
router.route('/').get((req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new project
router.route('/add').post((req, res) => {
    const { title, description, imageUrl, projectUrl, tags } = req.body;
    const newProject = new Project({ title, description, imageUrl, projectUrl, tags });

    newProject.save()
        .then(() => res.json('Project added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get a single project by ID
router.route('/:id').get((req, res) => {
    Project.findById(req.params.id)
        .then(project => res.json(project))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Update a project
router.route('/update/:id').post((req, res) => {
    Project.findById(req.params.id)
        .then(project => {
            project.title = req.body.title;
            project.description = req.body.description;
            project.imageUrl = req.body.imageUrl;
            project.projectUrl = req.body.projectUrl;
            project.tags = req.body.tags;

            project.save()
                .then(() => res.json('Project updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a project
router.route('/:id').delete((req, res) => {
    Project.findByIdAndDelete(req.params.id)
        .then(() => res.json('Project deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
