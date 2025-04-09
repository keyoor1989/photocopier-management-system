const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['repair', 'maintenance', 'installation', 'complaint', 'inspection'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in-progress', 'pending-parts', 'completed', 'cancelled'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reportedIssue: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledDate: Date,
  startTime: Date,
  endTime: Date,
  diagnosis: String,
  resolution: String,
  partsUsed: [{
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory'
    },
    quantity: Number,
    cost: Number
  }],
  laborCost: {
    hours: Number,
    rate: Number,
    total: Number
  },
  totalCost: Number,
  customerSignature: String,
  customerFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  },
  attachments: [{
    name: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
serviceSchema.index({ ticketNumber: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ priority: 1 });
serviceSchema.index({ machine: 1 });
serviceSchema.index({ customer: 1 });
serviceSchema.index({ assignedTo: 1 });
serviceSchema.index({ scheduledDate: 1 });
serviceSchema.index({ createdAt: 1 });

// Update the updatedAt field on save
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema); 