const mongoose = require('mongoose');
const logger = require('./logger');
const { initializeDatabase } = require('./initDb');

// Connection options with recommended settings
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority',
  connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 30000
};

// Connection state
let connectionAttempts = 0;
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Get MongoDB URI from environment with validation
function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  return uri;
}

// Exponential backoff function
const getRetryDelay = (attempt) => {
  return Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt), 30000); // Max 30 seconds
};

// Connection event handlers
function setupMongooseEvents() {
  mongoose.connection.on('connected', () => {
    logger.info(`MongoDB connected successfully to ${getMongoUri().replace(/\/\/[^@]+@/, '//****:****@')}`);
    connectionAttempts = 0; // Reset connection attempts on successful connection
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    logger.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

// Connection function with retry logic
const connectWithRetry = async () => {
  try {
    const uri = getMongoUri();
    await mongoose.connect(uri, connectionOptions);
    return mongoose.connection;
  } catch (err) {
    if (connectionAttempts < MAX_RETRIES) {
      const retryDelay = getRetryDelay(connectionAttempts);
      connectionAttempts++;
      logger.warn(`MongoDB connection failed. Retrying in ${retryDelay}ms... (Attempt ${connectionAttempts}/${MAX_RETRIES})`);
      logger.error('Connection error details:', err);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return connectWithRetry();
    } else {
      logger.error('Max retries reached. Could not connect to MongoDB:', err);
      throw new Error('Failed to connect to MongoDB after multiple attempts');
    }
  }
};

// Health check function
const checkConnection = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    if (state === 1) {
      return { 
        status: 'healthy',
        message: 'MongoDB is connected',
        details: {
          state: states[state],
          host: mongoose.connection.host,
          database: mongoose.connection.name
        }
      };
    } else {
      return { 
        status: 'unhealthy',
        message: `MongoDB connection state: ${states[state]}`,
        details: {
          state: states[state],
          lastError: mongoose.connection.lastError
        }
      };
    }
  } catch (err) {
    return { 
      status: 'error',
      message: err.message,
      details: {
        error: err.stack
      }
    };
  }
};

// Initialize connection
const init = async () => {
  try {
    setupMongooseEvents();
    await connectWithRetry();
    logger.info('MongoDB connected, initializing database...');
    await initializeDatabase();
    return mongoose.connection;
  } catch (err) {
    logger.error('Failed to initialize MongoDB connection:', err);
    throw err;
  }
};

module.exports = {
  init,
  checkConnection,
  connection: mongoose.connection
}; 