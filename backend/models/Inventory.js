const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    enum: ['spare-part', 'consumable', 'accessory', 'component'],
    required: true
  },
  compatibility: [{
    brand: String,
    models: [String]
  }],
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  stock: {
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    minQuantity: {
      type: Number,
      required: true,
      default: 10
    },
    reorderPoint: {
      type: Number,
      required: true,
      default: 20
    },
    location: {
      warehouse: String,
      shelf: String,
      bin: String
    }
  },
  pricing: {
    purchasePrice: {
      type: Number,
      required: true
    },
    sellingPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    lastPriceUpdate: {
      type: Date,
      default: Date.now
    }
  },
  unitOfMeasure: {
    type: String,
    required: true,
    default: 'piece'
  },
  status: {
    type: String,
    enum: ['active', 'discontinued', 'out-of-stock'],
    default: 'active'
  },
  transactions: [{
    type: {
      type: String,
      enum: ['purchase', 'sale', 'adjustment', 'return'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reference: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    price: Number,
    notes: String
  }],
  attachments: [{
    name: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    manufacturer: String,
    partNumber: String,
    barcode: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: 'cm'
      }
    }
  },
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
inventorySchema.index({ itemCode: 1 });
inventorySchema.index({ name: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ 'stock.quantity': 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ supplier: 1 });
inventorySchema.index({ 'compatibility.brand': 1 });
inventorySchema.index({ 'compatibility.models': 1 });

// Update the updatedAt field on save
inventorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema); 