const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const auth = require('../middleware/auth');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate Facebook caption
router.post('/facebook/caption', auth, [
  body('topic').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media expert. Generate an engaging Facebook caption that encourages interaction."
        },
        {
          role: "user",
          content: `Generate a Facebook caption for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const caption = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `Facebook Caption for ${topic}`,
      content: caption,
      type: 'facebook_caption',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        topic,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      caption,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating Facebook caption' });
  }
});

// Generate Facebook hashtags
router.post('/facebook/hashtags', auth, [
  body('topic').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media expert. Generate relevant and trending Facebook hashtags."
        },
        {
          role: "user",
          content: `Generate Facebook hashtags for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const hashtags = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `Facebook Hashtags for ${topic}`,
      content: hashtags,
      type: 'facebook_hashtag',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        topic,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      hashtags,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating Facebook hashtags' });
  }
});

// Generate Instagram caption
router.post('/instagram/caption', auth, [
  body('topic').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media expert. Generate an engaging Instagram caption that encourages interaction."
        },
        {
          role: "user",
          content: `Generate an Instagram caption for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const caption = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `Instagram Caption for ${topic}`,
      content: caption,
      type: 'instagram_caption',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        topic,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      caption,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating Instagram caption' });
  }
});

// Generate Instagram hashtags
router.post('/instagram/hashtags', auth, [
  body('topic').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media expert. Generate relevant and trending Instagram hashtags."
        },
        {
          role: "user",
          content: `Generate Instagram hashtags for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const hashtags = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `Instagram Hashtags for ${topic}`,
      content: hashtags,
      type: 'instagram_hashtag',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        topic,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      hashtags,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating Instagram hashtags' });
  }
});

// Generate YouTube title
router.post('/youtube/title', auth, [
  body('topic').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a YouTube expert. Generate an attention-grabbing YouTube title that is optimized for search."
        },
        {
          role: "user",
          content: `Generate a YouTube title for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const title = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `YouTube Title for ${topic}`,
      content: title,
      type: 'youtube_title',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        topic,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      title,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating YouTube title' });
  }
});

// Generate YouTube description
router.post('/youtube/description', auth, [
  body('topic').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a YouTube expert. Generate an optimized YouTube description that includes relevant keywords and calls to action."
        },
        {
          role: "user",
          content: `Generate a YouTube description for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const description = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `YouTube Description for ${topic}`,
      content: description,
      type: 'youtube_description',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        topic,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      description,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating YouTube description' });
  }
});

// Generate YouTube tags
router.post('/youtube/tags', auth, [
  body('topic').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a YouTube expert. Generate relevant YouTube tags that will help with discoverability."
        },
        {
          role: "user",
          content: `Generate YouTube tags for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const tags = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `YouTube Tags for ${topic}`,
      content: tags,
      type: 'youtube_tags',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        topic,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      tags,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating YouTube tags' });
  }
});

// Generate YouTube hashtags
router.post('/youtube/hashtags', auth, [
  body('topic').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a YouTube expert. Generate relevant and trending YouTube hashtags."
        },
        {
          role: "user",
          content: `Generate YouTube hashtags for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const hashtags = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `YouTube Hashtags for ${topic}`,
      content: hashtags,
      type: 'youtube_hashtags',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        topic,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      hashtags,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating YouTube hashtags' });
  }
});

module.exports = router; 