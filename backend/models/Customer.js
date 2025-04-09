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

const customerSchema = new mongoose.Schema({
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
    required: [true, 'Please add a phone number'],
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  type: {
    type: String,
    enum: ['individual', 'corporate'],
    default: 'individual'
  },
  companyName: String,
  companyRegistration: String,
  taxId: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  machines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine'
  }],
  contracts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  }],
  creditLimit: {
    type: Number,
    default: 0
  },
  paymentTerms: {
    type: String,
    default: 'net30'
  },
  notes: String,
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
  },
  company: {
    type: String
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch'
  },
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
customerSchema.index({ name: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ assignedTo: 1 });
customerSchema.index({ status: 1 });
customerSchema.index({ customerType: 1 });
customerSchema.index({ 'machines.serialNumber': 1 });

// Update the updatedAt field on save
customerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Customer', customerSchema); 