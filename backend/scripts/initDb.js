require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Machine = require('../models/Machine');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      return adminExists;
    }

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      status: 'active'
    });

    console.log('Admin user created:', adminUser.email);
    return adminUser;
  } catch (err) {
    console.error('Error creating admin user:', err);
    throw err;
  }
};

const createSampleCustomers = async (adminUser) => {
  try {
    const customers = [
      {
        name: 'ABC Corporation',
        email: 'contact@abccorp.com',
        phone: '123-456-7890',
        address: {
          street: '123 Business Ave',
          city: 'Business City',
          state: 'BS',
          zipCode: '12345',
          country: 'USA'
        },
        type: 'corporate',
        companyName: 'ABC Corporation',
        status: 'active',
        creditLimit: 10000,
        createdBy: adminUser._id
      },
      {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '098-765-4321',
        address: {
          street: '456 Personal St',
          city: 'Home City',
          state: 'HC',
          zipCode: '67890',
          country: 'USA'
        },
        type: 'individual',
        status: 'active',
        creditLimit: 1000,
        createdBy: adminUser._id
      }
    ];

    for (const customer of customers) {
      const exists = await Customer.findOne({ email: customer.email });
      if (!exists) {
        await Customer.create(customer);
        console.log('Customer created:', customer.name);
      }
    }
  } catch (err) {
    console.error('Error creating sample customers:', err);
    throw err;
  }
};

const createSampleMachines = async (adminUser) => {
  try {
    const customer = await Customer.findOne({ email: 'contact@abccorp.com' });
    
    const machines = [
      {
        serialNumber: 'PC001',
        model: 'WorkCentre 7845',
        brand: 'Xerox',
        type: 'photocopier',
        status: 'active',
        customer: customer._id,
        specifications: {
          color: true,
          duplexPrinting: true,
          paperSizes: ['A4', 'A3', 'Letter'],
          ppm: 45,
          maxResolution: '1200x1200',
          networkCapable: true,
          wirelessCapable: true
        },
        purchaseInfo: {
          date: new Date('2023-01-01'),
          price: 15000,
          warranty: {
            startDate: new Date('2023-01-01'),
            endDate: new Date('2024-01-01'),
            type: 'full',
            provider: 'Xerox'
          }
        },
        maintenanceSchedule: {
          lastMaintenance: new Date('2024-01-01'),
          nextMaintenance: new Date('2024-04-01'),
          frequency: 90,
          type: 'full'
        },
        createdBy: adminUser._id
      },
      {
        serialNumber: 'PR001',
        model: 'LaserJet Pro M428',
        brand: 'HP',
        type: 'printer',
        status: 'active',
        customer: customer._id,
        specifications: {
          color: false,
          duplexPrinting: true,
          paperSizes: ['A4', 'Letter'],
          ppm: 38,
          maxResolution: '1200x1200',
          networkCapable: true,
          wirelessCapable: true
        },
        purchaseInfo: {
          date: new Date('2023-02-01'),
          price: 5000,
          warranty: {
            startDate: new Date('2023-02-01'),
            endDate: new Date('2024-02-01'),
            type: 'limited',
            provider: 'HP'
          }
        },
        maintenanceSchedule: {
          lastMaintenance: new Date('2024-01-01'),
          nextMaintenance: new Date('2024-03-01'),
          frequency: 60,
          type: 'basic'
        },
        createdBy: adminUser._id
      }
    ];

    for (const machine of machines) {
      const exists = await Machine.findOne({ serialNumber: machine.serialNumber });
      if (!exists) {
        await Machine.create(machine);
        console.log('Machine created:', machine.serialNumber);
      }
    }
  } catch (err) {
    console.error('Error creating sample machines:', err);
    throw err;
  }
};

const initializeDb = async () => {
  try {
    await connectDB();
    const adminUser = await createAdminUser();
    await createSampleCustomers(adminUser);
    await createSampleMachines(adminUser);
    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }
};

initializeDb(); 