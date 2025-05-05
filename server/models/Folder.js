const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder'
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  content: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  }],
  subfolders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder'
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  settings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  images: [{
    type: String
  }],
  notes: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update the updatedAt field before saving
folderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder; 