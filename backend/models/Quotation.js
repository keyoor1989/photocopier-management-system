const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  description: String
}, { _id: false });

const quotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [itemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  validity: {
    type: Number,
    default: 30 // days
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
    default: 'draft'
  },
  remarks: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
quotationSchema.index({ quotationNumber: 1 }, { unique: true });
quotationSchema.index({ customer: 1 });
quotationSchema.index({ createdBy: 1 });
quotationSchema.index({ status: 1 });
quotationSchema.index({ createdAt: 1 });

// Generate quotation number before saving
quotationSchema.pre('save', async function(next) {
  if (!this.quotationNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.quotationNumber = `QT${year}${month}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Quotation', quotationSchema); 