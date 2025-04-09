const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  accountName: String,
  accountNumber: String,
  bankName: String,
  ifscCode: String,
  branch: String
}, { _id: false });

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Please add a contact person']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
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
  gstNumber: {
    type: String,
    required: [true, 'Please add a GST number']
  },
  bankDetails: bankDetailsSchema,
  itemsSupplied: [{
    type: String,
    enum: ['machine', 'toner', 'drum', 'spare', 'paper', 'other']
  }]
}, {
  timestamps: true
});

// Create indexes
supplierSchema.index({ name: 1 });
supplierSchema.index({ email: 1 });
supplierSchema.index({ phone: 1 });
supplierSchema.index({ gstNumber: 1 }, { unique: true });
supplierSchema.index({ itemsSupplied: 1 });

module.exports = mongoose.model('Supplier', supplierSchema); 