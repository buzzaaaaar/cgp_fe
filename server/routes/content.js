const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const { OpenAI } = require('openai');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Project = require('../models/Project');
const Folder = require('../models/Folder');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate content
router.post('/generate', auth, [
  body('type').isIn([
    'meta_title',
    'meta_description',
    'sub_keywords',
    'topical_map',
    'blog_post_ideas',
    'json_ld_faq',
    'youtube_tags',
    'youtube_content_ideas',
    'youtube_hashtags',
    'instagram_caption',
    'instagram_content_ideas',
    'instagram_hashtags',
    'facebook_caption',
    'facebook_content_ideas',
    'facebook_hashtags'
  ]),
  body('prompt').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, prompt, projectId, folderId } = req.body;
    const userId = req.user.userId;

    // Generate content using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(type)
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const generatedContent = completion.choices[0].message.content;

    res.json({
      content: generatedContent
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ message: 'Error generating content' });
  }
});

// Save content
router.post('/', auth, [
  body('name').isString().notEmpty(),
  body('type').isIn([
    'meta_title',
    'meta_description',
    'sub_keywords',
    'topical_map',
    'blog_post_ideas',
    'json_ld_faq',
    'youtube_tags',
    'youtube_content',
    'youtube_hashtags',
    'instagram_caption',
    'instagram_content',
    'instagram_hashtags',
    'facebook_caption',
    'facebook_content',
    'facebook_hashtags'
  ]),
  body('data').isObject(),
  body('projectId').isMongoId(),
  body('folderId').isMongoId()
], async (req, res) => {
  try {
    console.log('Content save route - Request body:', req.body);
    console.log('Content save route - User:', req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Content save route - Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, data, projectId, folderId } = req.body;
    const userId = req.user.userId;

    // Verify project and folder exist and user has access
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

    const folder = await Folder.findOne({
      _id: folderId,
      projectId: projectId
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Create new content document
    const content = new Content({
      name,
      type,
      data,
      project: projectId,
      folder: folderId,
      owner: userId
    });

    console.log('Content save route - Content to save:', content);

    // Save to MongoDB
    const savedContent = await content.save();
    console.log('Content save route - Content saved successfully:', savedContent);

    res.status(201).json(savedContent);
  } catch (error) {
    console.error('Content save route - Save error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error saving content', error: error.message });
  }
});

// Get user's content
router.get('/my-content', auth, async (req, res) => {
  try {
    const content = await Content.find({ owner: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// Get content for a folder
router.get('/folder/:folderId', auth, async (req, res) => {
  try {
    const { folderId } = req.params;
    console.log('Fetching content for folder:', folderId);
    console.log('User ID:', req.user.userId);

    // Validate folder exists and user has access
    const folder = await Folder.findOne({ _id: folderId });

    console.log('Found folder:', folder);

    if (!folder) {
      console.log('Folder not found');
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Get project to check access
    const project = await Project.findOne({ _id: folder.projectId });

    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to the project
    const hasAccess = project.owner.toString() === req.user.userId ||
      project.sharedWith.some(share => share.user.toString() === req.user.userId);

    console.log('User has access:', hasAccess);

    if (!hasAccess) {
      console.log('Access denied');
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get content for the folder
    const content = await Content.find({ folder: folderId })
      .sort({ createdAt: -1 });

    console.log('Found content:', content);

    res.json(content);
  } catch (error) {
    console.error('Error in folder content route:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get content by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// Update content
router.put('/:id', auth, [
  body('title').optional().isString(),
  body('content').optional().isString(),
  body('status').optional().isIn(['draft', 'published', 'archived'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { $set: req.body },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating content' });
  }
});

// Delete content
router.delete('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting content' });
  }
});

// Save content to a project and folder
router.post('/save', auth, async (req, res) => {
  try {
    const { projectId, folderId, content, contentType } = req.body;

    // Validate project exists and user has access
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user.id },
        { sharedWith: { $elemMatch: { user: req.user.id } } }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Validate folder exists and belongs to project
    const folder = await Folder.findOne({
      _id: folderId,
      project: projectId
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Create new content
    const newContent = new Content({
      content,
      contentType,
      project: projectId,
      folder: folderId,
      createdBy: req.user.id
    });

    await newContent.save();

    res.json(newContent);
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to get system prompt based on content type
function getSystemPrompt(type) {
  const prompts = {
    meta_title: "You are an SEO expert. Generate an optimized meta title that is compelling and within 60 characters. Focus on the main keyword and make it click-worthy.",
    meta_description: "You are an SEO expert. Generate an optimized meta description that is compelling and within 160 characters. Include the main keyword and a call to action.",
    sub_keywords: "You are an SEO expert. Generate relevant sub-keywords that complement the main keyword. Focus on long-tail keywords and related terms.",
    topical_map: "You are a content strategist. Generate a comprehensive topical map for the given subject. Include main topics and subtopics.",
    blog_post_ideas: "You are a content strategist. Generate unique and engaging blog post ideas for the given topic. Focus on trending topics and user intent.",
    json_ld_faq: "You are an SEO expert. Generate structured JSON-LD FAQ data for the given content. Include relevant questions and answers.",
    youtube_tags: "You are a YouTube expert. Generate relevant YouTube tags that will help with discoverability. Include both specific and broad tags.",
    youtube_content_ideas: "You are a YouTube expert. Generate engaging video content ideas for the given topic. Focus on trending topics and viewer engagement.",
    youtube_hashtags: "You are a YouTube expert. Generate relevant and trending YouTube hashtags. Include both niche and popular hashtags.",
    instagram_caption: "You are a social media expert. Generate an engaging Instagram caption that encourages interaction. Include relevant hashtags and emojis.",
    instagram_content_ideas: "You are a social media expert. Generate unique Instagram content ideas. Focus on visual appeal and engagement.",
    instagram_hashtags: "You are a social media expert. Generate relevant and trending Instagram hashtags. Include both niche and popular hashtags.",
    facebook_caption: "You are a social media expert. Generate an engaging Facebook caption that encourages interaction. Focus on conversation starters.",
    facebook_content_ideas: "You are a social media expert. Generate unique Facebook content ideas. Focus on engagement and shareability.",
    facebook_hashtags: "You are a social media expert. Generate relevant and trending Facebook hashtags. Include both niche and popular hashtags."
  };

  return prompts[type] || "Generate content based on the given prompt.";
}

module.exports = router; 