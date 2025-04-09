const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  model: String,
  serialNumber: String,
  installationDate: Date,
  warrantyEnd: Date,
  contractType: String
}, { _id: false });

const noteSchema = new mongoose.Schema({
  content: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  name: String,
  path: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  company: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  machines: [machineSchema],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  city: String,
  state: String,
  customerType: {
    type: String,
    enum: ['individual', 'business', 'government', 'corporate'],
    required: true
  },
  leadSource: {
    type: String,
    enum: ['whatsapp', 'youtube', 'indiamart', 'referral', 'walk-in', 'other']
  },
  documents: [documentSchema]
}, {
  timestamps: true
});

// Create indexes
CustomerSchema.index({ name: 1 });
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ assignedTo: 1 });
CustomerSchema.index({ status: 1 });
CustomerSchema.index({ customerType: 1 });
CustomerSchema.index({ 'machines.serialNumber': 1 });

module.exports = mongoose.model('Customer', CustomerSchema); 