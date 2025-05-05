const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const auth = require('../middleware/auth');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate meta title
router.post('/meta-title', auth, [
  body('keyword').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { keyword, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate an optimized meta title that is compelling and within 60 characters."
        },
        {
          role: "user",
          content: `Generate a meta title for: ${keyword}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const metaTitle = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `Meta Title for ${keyword}`,
      content: metaTitle,
      type: 'meta_title',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        keyword,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      metaTitle,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating meta title' });
  }
});

// Generate meta description
router.post('/meta-description', auth, [
  body('keyword').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { keyword, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate an optimized meta description that is compelling and within 160 characters."
        },
        {
          role: "user",
          content: `Generate a meta description for: ${keyword}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const metaDescription = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `Meta Description for ${keyword}`,
      content: metaDescription,
      type: 'meta_description',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        keyword,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      metaDescription,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating meta description' });
  }
});

// Generate SEO keywords
router.post('/keywords', auth, [
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
          content: "You are an SEO expert. Generate relevant and high-value SEO keywords for the given topic."
        },
        {
          role: "user",
          content: `Generate SEO keywords for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const keywords = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `SEO Keywords for ${topic}`,
      content: keywords,
      type: 'seo_keywords',
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
      keywords,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating SEO keywords' });
  }
});

// Generate sub-keywords
router.post('/sub-keywords', auth, [
  body('mainKeyword').isString().notEmpty(),
  body('projectId').optional().isMongoId(),
  body('folderId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mainKeyword, projectId, folderId } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate relevant sub-keywords that complement the main keyword."
        },
        {
          role: "user",
          content: `Generate sub-keywords for: ${mainKeyword}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const subKeywords = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `Sub-keywords for ${mainKeyword}`,
      content: subKeywords,
      type: 'sub_keywords',
      owner: req.user.userId,
      project: projectId,
      folder: folderId,
      settings: {
        mainKeyword,
        model: "gpt-4",
        temperature: 0.7
      }
    });

    await content.save();

    res.json({
      subKeywords,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating sub-keywords' });
  }
});

// Generate JSON-LD FAQ
router.post('/json-ld-faq', auth, [
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
          content: "You are an SEO expert. Generate structured JSON-LD FAQ data for the given topic."
        },
        {
          role: "user",
          content: `Generate JSON-LD FAQ for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const jsonLdFaq = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `JSON-LD FAQ for ${topic}`,
      content: jsonLdFaq,
      type: 'json_ld',
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
      jsonLdFaq,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating JSON-LD FAQ' });
  }
});

// Generate topical map
router.post('/topical-map', auth, [
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
          content: "You are a content strategist. Generate a comprehensive topical map for the given subject."
        },
        {
          role: "user",
          content: `Generate a topical map for: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const topicalMap = completion.choices[0].message.content;

    // Save to database
    const content = new Content({
      title: `Topical Map for ${topic}`,
      content: topicalMap,
      type: 'topical_map',
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
      topicalMap,
      id: content._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating topical map' });
  }
});

module.exports = router; 