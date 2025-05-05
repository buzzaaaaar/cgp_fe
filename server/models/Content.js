const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
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
    ]
  },
  data: {
    type: Object,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', ContentSchema); 