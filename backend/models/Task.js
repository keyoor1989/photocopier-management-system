const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'relatedToModel'
  },
  relatedToModel: {
    type: String,
    required: true,
    enum: ['Customer', 'Service', 'Sale']
  }
}, {
  timestamps: true
});

// Create indexes
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ assignedBy: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ relatedTo: 1, relatedToModel: 1 });

module.exports = mongoose.model('Task', taskSchema); 