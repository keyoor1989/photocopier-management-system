const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please add an item name'],
    trim: true
  },
  itemType: {
    type: String,
    enum: ['machine', 'toner', 'drum', 'spare', 'paper', 'other'],
    required: true
  },
  itemCode: {
    type: String,
    required: true,
    unique: true
  },
  barcode: String,
  compatibleMachines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine'
  }],
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  minStockLevel: {
    type: Number,
    required: true,
    default: 5
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  gstApplicable: {
    type: Boolean,
    default: true
  },
  gstRate: {
    type: Number,
    default: 18
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  location: {
    type: String,
    enum: ['indore', 'bhopal', 'jabalpur'],
    required: true
  },
  lastPurchased: Date,
  lastPurchasePrice: Number
}, {
  timestamps: true
});

// Create indexes
inventorySchema.index({ itemCode: 1 }, { unique: true });
inventorySchema.index({ barcode: 1 });
inventorySchema.index({ itemType: 1 });
inventorySchema.index({ location: 1 });
inventorySchema.index({ supplier: 1 });
inventorySchema.index({ stockQuantity: 1 });
inventorySchema.index({ compatibleMachines: 1 });

module.exports = mongoose.model('Inventory', inventorySchema); 