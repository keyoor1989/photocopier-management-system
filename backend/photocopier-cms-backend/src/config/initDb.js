const mongoose = require('mongoose');
const logger = require('./logger');

// Initial user data
const initialUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDOMJWFb5Jsq', // admin123
    role: 'admin',
    status: 'active'
  }
];

// Initial product categories
const initialProducts = [
  {
    name: 'Basic Photocopier',
    model: 'PC-100',
    description: 'Entry level photocopier for small offices',
    category: 'photocopier',
    price: 499.99,
    stock: 10
  },
  {
    name: 'Professional Printer',
    model: 'PP-200',
    description: 'High-speed professional printer',
    category: 'printer',
    price: 799.99,
    stock: 5
  }
];

// Initial customer data
const initialCustomers = [
  {
    name: 'ABC Corporation',
    email: 'contact@abccorp.com',
    phone: '123-456-7890',
    address: '123 Business St',
    type: 'corporate'
  }
];

// Initial quotation data
const initialQuotations = [
  {
    customerId: null, // Will be set after customer creation
    items: [], // Will be populated after products are created
    status: 'pending',
    totalAmount: 1299.98,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
];

async function initializeDatabase() {
  try {
    // Check if database is already initialized
    const usersCount = await mongoose.connection.collection('users').countDocuments();
    if (usersCount > 0) {
      logger.info('Database already initialized');
      return;
    }

    // Create collections
    logger.info('Creating collections...');
    await mongoose.connection.createCollection('users');
    await mongoose.connection.createCollection('products');
    await mongoose.connection.createCollection('customers');
    await mongoose.connection.createCollection('quotations');

    // Insert initial data
    logger.info('Inserting initial data...');
    const users = await mongoose.connection.collection('users').insertMany(initialUsers);
    const products = await mongoose.connection.collection('products').insertMany(initialProducts);
    const customers = await mongoose.connection.collection('customers').insertMany(initialCustomers);

    // Update quotation with references
    initialQuotations[0].customerId = customers.insertedIds[0];
    initialQuotations[0].items = [
      {
        productId: products.insertedIds[0],
        quantity: 1,
        unitPrice: initialProducts[0].price
      },
      {
        productId: products.insertedIds[1],
        quantity: 1,
        unitPrice: initialProducts[1].price
      }
    ];

    await mongoose.connection.collection('quotations').insertMany(initialQuotations);

    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { initializeDatabase }; 