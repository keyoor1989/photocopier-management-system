const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      'rent',
      'utilities',
      'salaries',
      'maintenance',
      'travel',
      'office-supplies',
      'marketing',
      'insurance',
      'taxes',
      'other'
    ],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank-transfer', 'cheque'],
    required: true
  },
  reference: {
    type: String,
    required: true
  },
  office: {
    type: String,
    enum: ['indore', 'bhopal', 'jabalpur'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
expenseSchema.index({ category: 1 });
expenseSchema.index({ date: 1 });
expenseSchema.index({ office: 1 });
expenseSchema.index({ createdBy: 1 });
expenseSchema.index({ paymentMode: 1 });

module.exports = mongoose.model('Expense', expenseSchema); 