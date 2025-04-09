const mongoose = require('mongoose');

const rentalPriceSchema = new mongoose.Schema({
  daily: Number,
  monthly: Number
}, { _id: false });

const machineSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Please add a brand name']
  },
  model: {
    type: String,
    required: [true, 'Please add a model name']
  },
  type: {
    type: String,
    enum: ['photocopier', 'printer', 'scanner', 'multifunction'],
    required: true
  },
  specifications: {
    type: Map,
    of: String
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  isAvailableForRent: {
    type: Boolean,
    default: false
  },
  rentalPrice: rentalPriceSchema,
  compatibleConsumables: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  }]
}, {
  timestamps: true
});

// Create indexes
machineSchema.index({ brand: 1, model: 1 }, { unique: true });
machineSchema.index({ type: 1 });
machineSchema.index({ isAvailableForRent: 1 });
machineSchema.index({ compatibleConsumables: 1 });

module.exports = mongoose.model('Machine', machineSchema); 