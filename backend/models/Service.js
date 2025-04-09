const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  model: String,
  serialNumber: String
}, { _id: false });

const partsUsedSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  },
  quantity: Number,
  price: Number
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  machine: {
    type: machineSchema,
    required: true
  },
  issueDescription: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in-progress', 'parts-waiting', 'completed', 'closed'],
    default: 'open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  partsUsed: [partsUsedSchema],
  serviceCharge: Number,
  serviceDate: Date,
  completionDate: Date,
  customerSignature: String,
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
serviceSchema.index({ ticketId: 1 }, { unique: true });
serviceSchema.index({ customer: 1 });
serviceSchema.index({ 'machine.serialNumber': 1 });
serviceSchema.index({ assignedTo: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ priority: 1 });
serviceSchema.index({ serviceDate: 1 });

// Generate ticket ID before saving
serviceSchema.pre('save', async function(next) {
  if (!this.ticketId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.ticketId = `SRV${year}${month}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema); 