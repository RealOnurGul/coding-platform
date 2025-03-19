const { Sequelize } = require('sequelize');
const winston = require('winston');

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/database.log' })
  ]
});

// Get MySQL connection parameters from environment variables
const host = process.env.DB_HOST || 'localhost';
const database = process.env.DB_NAME || 'coding_platform';
const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const port = process.env.DB_PORT || 3306;

// Create Sequelize instance with connection pooling for high scalability
const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? msg => logger.debug(msg) : false,
  
  // Connection pool configuration for high-scale usage
  pool: {
    max: 20,               // Maximum number of connections in pool
    min: 5,                // Minimum number of connections in pool
    acquire: 30000,        // Maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000            // Maximum time, in milliseconds, that a connection can be idle before being released
  },
  
  // Optimize for high performance
  dialectOptions: {
    connectTimeout: 60000, // Increase connection timeout for busy servers
    // Additional MySQL-specific options
    dateStrings: true,     // Force date types to be returned as strings instead of JS Date objects
    typeCast: true
  },
  
  // Handling timezone issues
  timezone: '+00:00'       // Use UTC globally
});

/**
 * Initialize database connection
 * @returns {Promise} Promise that resolves when connection is established
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL database connection established successfully');
    
    // Setup graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await sequelize.close();
        logger.info('MySQL connection closed due to app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MySQL connection:', err);
        process.exit(1);
      }
    });
    
    return sequelize;
  } catch (error) {
    logger.error(`MySQL connection failed: ${error.message}`);
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { 
  sequelize, 
  connectDB,
  Sequelize 
}; 