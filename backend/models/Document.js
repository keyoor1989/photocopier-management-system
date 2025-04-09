const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: String,
  fileType: {
    type: String,
    enum: ['brochure', 'manual', 'video', 'image', 'contract', 'other'],
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  relatedMachines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine'
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
documentSchema.index({ title: 1 });
documentSchema.index({ fileType: 1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ relatedMachines: 1 });
documentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Document', documentSchema); 