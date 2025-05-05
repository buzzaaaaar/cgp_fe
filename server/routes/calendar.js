const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const CalendarEvent = require('../models/CalendarEvent');
const Folder = require('../models/Folder');
const Project = require('../models/Project');

// Create a new calendar event
router.post('/', auth, [
  body('title').isString().notEmpty(),
  body('dateTime').isISO8601(),
  body('reminder').isBoolean(),
  body('folderId').isMongoId(),
  body('projectId').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, dateTime, reminder, folderId, projectId } = req.body;
    const userId = req.user.userId;

    // Verify folder exists and belongs to project
    const folder = await Folder.findOne({
      _id: folderId,
      projectId: projectId
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Verify project exists and user has access
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: userId },
        { 'sharedWith.user': userId }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Create new calendar event
    const event = new CalendarEvent({
      title,
      dateTime,
      reminder,
      folder: folderId,
      project: projectId,
      owner: userId
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ message: 'Error creating calendar event' });
  }
});

// Get all calendar events for a user
router.get('/my-events', auth, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ owner: req.user.userId })
      .populate('folder', 'name')
      .populate('project', 'name')
      .sort({ dateTime: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ message: 'Error fetching calendar events' });
  }
});

// Get calendar events for a specific folder
router.get('/folder/:folderId', auth, async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user.userId;

    // Verify folder exists and user has access
    const folder = await Folder.findOne({ _id: folderId })
      .populate('project');

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const hasAccess = folder.project.owner.toString() === userId ||
      folder.project.sharedWith.some(share => share.user.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const events = await CalendarEvent.find({ folder: folderId })
      .sort({ dateTime: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching folder calendar events:', error);
    res.status(500).json({ message: 'Error fetching folder calendar events' });
  }
});

// Delete a calendar event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ message: 'Error deleting calendar event' });
  }
});

// Update a calendar event
router.put('/:id', auth, [
  body('title').isString().notEmpty(),
  body('dateTime').isISO8601(),
  body('reminder').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, dateTime, reminder } = req.body;
    const userId = req.user.userId;

    // Find and update the event
    const event = await CalendarEvent.findOneAndUpdate(
      { _id: req.params.id, owner: userId },
      { title, dateTime, reminder },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ message: 'Error updating calendar event' });
  }
});

module.exports = router; 