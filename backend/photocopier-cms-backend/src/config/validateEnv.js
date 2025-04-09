const logger = require('./logger');

const validateEnv = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'PORT',
    'NODE_ENV',
    'JWT_SECRET',
    'JWT_EXPIRE'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Please check your .env file or environment configuration');
    process.exit(1);
  }

  return true;
};

module.exports = validateEnv; 