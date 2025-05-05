const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create new project
router.post('/', auth, [
  body('name').isString().notEmpty(),
  body('description').optional().isString(),
  body('type').isIn(['blog', 'social', 'seo', 'content', 'design'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, type } = req.body;

    const project = new Project({
      name,
      description,
      type,
      owner: req.user.userId
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Get user's projects
router.get('/my-projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get shared projects
router.get('/shared', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const sharedProjects = await Project.find({
      'sharedWith.username': user.username
    }).populate('owner', 'username');
    
    // Add permission level to each project
    const projectsWithPermissions = sharedProjects.map(project => {
      const sharedWith = project.sharedWith.find(sw => sw.username === user.username);
      return {
        ...project.toObject(),
        userPermission: sharedWith.permission
      };
    });
    
    res.json(projectsWithPermissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching shared projects' });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Update project
router.put('/:id', auth, [
  body('name').optional().isString(),
  body('description').optional().isString(),
  body('status').optional().isIn(['active', 'archived', 'deleted'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { $set: req.body },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

// Share project with users
router.post('/:id/share', auth, [
  body('usernames').isArray(),
  body('usernames.*').isString().notEmpty(),
  body('permission').isIn(['view', 'edit'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { usernames, permission } = req.body;
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify that all usernames exist
    const users = await User.find({ username: { $in: usernames } });
    const foundUsernames = users.map(user => user.username);
    const invalidUsernames = usernames.filter(username => !foundUsernames.includes(username));

    if (invalidUsernames.length > 0) {
      return res.status(400).json({ 
        message: 'Some users were not found', 
        invalidUsernames 
      });
    }

    // Add new users to sharedWith array, avoiding duplicates
    const newSharedUsers = foundUsernames.map(username => ({
      username,
      permission
    }));

    // Remove any existing entries for these users
    project.sharedWith = project.sharedWith.filter(
      user => !foundUsernames.includes(user.username)
    );

    // Add the new entries
    project.sharedWith.push(...newSharedUsers);
    await project.save();

    res.json({ 
      message: 'Project shared successfully',
      sharedWith: project.sharedWith
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sharing project' });
  }
});

// Remove user from shared project
router.delete('/:id/share/:username', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const username = req.params.username;
    project.sharedWith = project.sharedWith.filter(u => u.username !== username);
    await project.save();

    res.json({ 
      message: 'User removed from project',
      sharedWith: project.sharedWith
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing user from project' });
  }
});

module.exports = router; 