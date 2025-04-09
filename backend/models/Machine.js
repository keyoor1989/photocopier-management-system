const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: [true, 'Please add a serial number'],
    unique: true,
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please add a model number']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand name']
  },
  type: {
    type: String,
    enum: ['photocopier', 'printer', 'scanner', 'multifunction'],
    required: [true, 'Please specify the machine type']
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'repair', 'retired'],
    default: 'active'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  location: {
    address: String,
    floor: String,
    department: String,
    notes: String
  },
  specifications: {
    color: Boolean,
    duplexPrinting: Boolean,
    paperSizes: [String],
    ppm: Number, // Pages per minute
    maxResolution: String,
    networkCapable: Boolean,
    wirelessCapable: Boolean
  },
  purchaseInfo: {
    date: Date,
    price: Number,
    warranty: {
      startDate: Date,
      endDate: Date,
      type: String,
      provider: String
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    }
  },
  maintenanceSchedule: {
    lastMaintenance: Date,
    nextMaintenance: Date,
    frequency: Number, // in days
    type: String
  },
  meterReadings: [{
    date: Date,
    value: Number,
    type: String, // e.g., 'black', 'color'
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  serviceHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceTicket'
  }],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
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
  }
});

// Update the updatedAt field on save
machineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for frequently queried fields
machineSchema.index({ serialNumber: 1 });
machineSchema.index({ model: 1 });
machineSchema.index({ brand: 1 });
machineSchema.index({ status: 1 });
machineSchema.index({ customer: 1 });
machineSchema.index({ 'purchaseInfo.warranty.endDate': 1 });
machineSchema.index({ 'maintenanceSchedule.nextMaintenance': 1 });

module.exports = mongoose.model('Machine', machineSchema); 