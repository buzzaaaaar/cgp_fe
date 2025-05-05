const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Folder = require('../models/Folder');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
const Project = require('../models/Project');

// Create new folder
router.post('/', auth, [
  body('name').isString().notEmpty(),
  body('description').optional().isString(),
  body('parentFolder').optional().isMongoId(),
  body('isPublic').optional().isBoolean(),
  body('projectId').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, parentFolder, isPublic, projectId } = req.body;

    // Check if user has permission to create folder in this project
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user.userId },
        { 
          'sharedWith': {
            $elemMatch: {
              username: (await User.findById(req.user.userId)).username,
              permission: 'edit'
            }
          }
        }
      ]
    });

    if (!project) {
      return res.status(403).json({ message: 'You do not have permission to create folders in this project' });
    }

    const folder = new Folder({
      name,
      description,
      owner: req.user.userId,
      parentFolder,
      isPublic,
      projectId
    });

    await folder.save();

    // If this is a subfolder, update the parent folder
    if (parentFolder) {
      await Folder.findByIdAndUpdate(
        parentFolder,
        { $push: { subfolders: folder._id } }
      );
    }

    res.status(201).json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating folder' });
  }
});

// Get user's folders
router.get('/my-folders', auth, async (req, res) => {
  try {
    const { projectId } = req.query;
    console.log('Fetching folders for user:', req.user.userId, 'projectId:', projectId); // Debug log
    
    // Get all folders in the project, regardless of owner
    const query = { projectId };
    
    console.log('Folder query:', query); // Debug log
    const folders = await Folder.find(query).sort({ createdAt: -1 });
    console.log('Found folders:', folders.length); // Debug log
    
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ message: 'Error fetching folders' });
  }
});

// Helper function to get shared project IDs
async function getSharedProjectIds(userId) {
  try {
    console.log('Getting shared project IDs for user:', userId); // Debug log
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return [];
    }
    
    const sharedProjects = await Project.find({
      'sharedWith.username': user.username
    });
    
    console.log('Found shared projects:', sharedProjects.length); // Debug log
    return sharedProjects.map(project => project._id);
  } catch (error) {
    console.error('Error getting shared project IDs:', error);
    return [];
  }
}

// Get folder by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    res.json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching folder' });
  }
});

// Update folder
router.put('/:id', auth, [
  body('name').optional().isString(),
  body('description').optional().isString(),
  body('parentFolder').optional().isMongoId(),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const folder = await Folder.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.userId },
        { 
          projectId: { $in: await getSharedProjectIds(req.user.userId) },
          'project.sharedWith': {
            $elemMatch: {
              username: (await User.findById(req.user.userId)).username,
              permission: 'edit'
            }
          }
        }
      ]
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found or you do not have permission to edit' });
    }

    const updatedFolder = await Folder.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedFolder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating folder' });
  }
});

// Delete folder
router.delete('/:id', auth, async (req, res) => {
  try {
    // First get the folder
    const folder = await Folder.findOne({
      _id: req.params.id
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Then check if user has permission to delete this folder
    const project = await Project.findOne({
      _id: folder.projectId,
      $or: [
        { owner: req.user.userId },
        { 
          'sharedWith': {
            $elemMatch: {
              username: (await User.findById(req.user.userId)).username,
              permission: 'edit'
            }
          }
        }
      ]
    });

    if (!project) {
      return res.status(403).json({ message: 'You do not have permission to delete this folder' });
    }

    // If this is a subfolder, remove it from the parent folder
    if (folder.parentFolder) {
      await Folder.findByIdAndUpdate(
        folder.parentFolder,
        { $pull: { subfolders: folder._id } }
      );
    }

    await Folder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting folder' });
  }
});

// Move content to folder
router.post('/:id/move-content', auth, [
  body('contentIds').isArray(),
  body('contentIds.*').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { contentIds } = req.body;
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Update content items to point to this folder
    await Content.updateMany(
      { _id: { $in: contentIds }, owner: req.user.userId },
      { $set: { folder: folder._id } }
    );

    res.json({ message: 'Content moved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error moving content' });
  }
});

// Add new route to handle adding images and notes to a folder
router.post('/:id/add-items', auth, [
  body('images').optional().isArray(),
  body('notes').optional().isArray(),
  body('notes.*.text').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { images, notes } = req.body;
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    if (images) {
      folder.images.push(...images);
    }

    if (notes) {
      folder.notes.push(...notes);
    }

    await folder.save();
    res.json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding items to folder' });
  }
});

// Add route to handle file uploads and notes
router.post('/:id/items', auth, upload.array('images', 10), async (req, res) => {
  try {
    // First get the folder
    const folder = await Folder.findOne({
      _id: req.params.id
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Then check if user has permission to edit this folder
    const project = await Project.findOne({
      _id: folder.projectId,
      $or: [
        { owner: req.user.userId },
        { 
          'sharedWith': {
            $elemMatch: {
              username: (await User.findById(req.user.userId)).username,
              permission: 'edit'
            }
          }
        }
      ]
    });

    if (!project) {
      return res.status(403).json({ message: 'You do not have permission to edit this folder' });
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
      folder.images.push(...imageUrls);
    }

    // Handle notes
    if (req.body.notes) {
      // If notes is a string, it's a single note
      if (typeof req.body.notes === 'string') {
        folder.notes.push(req.body.notes);
      }
      // If notes is an array, add all notes
      else if (Array.isArray(req.body.notes)) {
        folder.notes.push(...req.body.notes);
      }
    }

    await folder.save();
    res.json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding items to folder' });
  }
});

// Add route to get folder items
router.get('/:id/items', auth, async (req, res) => {
  try {
    // First get the folder
    const folder = await Folder.findOne({
      _id: req.params.id
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Then check if user has access to the project
    const project = await Project.findOne({
      _id: folder.projectId,
      $or: [
        { owner: req.user.userId },
        { 
          'sharedWith': {
            $elemMatch: {
              username: (await User.findById(req.user.userId)).username
            }
          }
        }
      ]
    });

    if (!project) {
      return res.status(403).json({ message: 'You do not have access to this folder' });
    }

    res.json({
      images: folder.images,
      notes: folder.notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching folder items' });
  }
});

// Add route to delete an image
router.delete('/:id/images/:imageIndex', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.userId },
        { 
          projectId: { $in: await getSharedProjectIds(req.user.userId) },
          'project.sharedWith': {
            $elemMatch: {
              username: (await User.findById(req.user.userId)).username,
              permission: 'edit'
            }
          }
        }
      ]
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found or you do not have permission to edit' });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    if (imageIndex >= 0 && imageIndex < folder.images.length) {
      folder.images.splice(imageIndex, 1);
      await folder.save();
      res.json(folder);
    } else {
      res.status(400).json({ message: 'Invalid image index' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

// Add route to delete a note
router.delete('/:id/notes/:noteIndex', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.userId },
        { 
          projectId: { $in: await getSharedProjectIds(req.user.userId) },
          'project.sharedWith': {
            $elemMatch: {
              username: (await User.findById(req.user.userId)).username,
              permission: 'edit'
            }
          }
        }
      ]
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found or you do not have permission to edit' });
    }

    const noteIndex = parseInt(req.params.noteIndex);
    if (noteIndex >= 0 && noteIndex < folder.notes.length) {
      folder.notes.splice(noteIndex, 1);
      await folder.save();
      res.json(folder);
    } else {
      res.status(400).json({ message: 'Invalid note index' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router; 