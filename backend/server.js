const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Static files directory for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes (we'll create these next)
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const customerRoutes = require('./routes/customers');
const machineRoutes = require('./routes/machines');
const inventoryRoutes = require('./routes/inventory');
const serviceRoutes = require('./routes/services');
const saleRoutes = require('./routes/sales');
const quotationRoutes = require('./routes/quotations');
const taskRoutes = require('./routes/tasks');
const expenseRoutes = require('./routes/expenses');
const documentRoutes = require('./routes/documents');
const supplierRoutes = require('./routes/suppliers');
const dashboardRoutes = require('./routes/dashboard');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Base route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Photocopier Dealership Management System API' });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
