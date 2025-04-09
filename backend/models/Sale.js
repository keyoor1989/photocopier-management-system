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
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  }
}, { _id: false });

const deliveryDetailsSchema = new mongoose.Schema({
  trackingInfo: String,
  courierName: String,
  trackingNumber: String,
  deliveryDate: Date,
  notes: String
}, { _id: false });

const saleSchema = new mongoose.Schema({
  invoiceNumber: {
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
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank-transfer', 'cheque'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'complete'],
    default: 'pending'
  },
  paymentDue: Date,
  office: {
    type: String,
    enum: ['indore', 'bhopal', 'jabalpur'],
    required: true
  },
  salesPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'courier', 'transport', 'hand-delivery'],
    required: true
  },
  deliveryDetails: deliveryDetailsSchema
}, {
  timestamps: true
});

// Create indexes
saleSchema.index({ invoiceNumber: 1 }, { unique: true });
saleSchema.index({ customer: 1 });
saleSchema.index({ salesPerson: 1 });
saleSchema.index({ office: 1 });
saleSchema.index({ paymentStatus: 1 });
saleSchema.index({ createdAt: 1 });

// Generate invoice number before saving
saleSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV${year}${month}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Sale', saleSchema); 