const bcrypt = require('bcryptjs');
const { sequelize } = require('./database');
const { User, UserPreference, UserStats, Theme } = require('../models/User');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'migration' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/migration.log' })
  ]
});

/**
 * Seed themes into the database
 */
const seedThemes = async (transaction) => {
  logger.info('Seeding themes...');
  
  const themeNames = [
    'arrays', 'strings', 'linked-lists', 'stacks', 'queues', 
    'trees', 'graphs', 'sorting', 'dynamic-programming', 'greedy',
    'backtracking', 'recursion', 'bit-manipulation', 'math', 'database'
  ];
  
  // Create themes in database if they don't exist
  for (const themeName of themeNames) {
    const [theme, created] = await Theme.findOrCreate({
      where: { name: themeName },
      transaction
    });
    
    if (created) {
      logger.info(`Created theme: ${themeName}`);
    }
  }
};

/**
 * Create admin user if it doesn't exist
 */
const createAdminUser = async (transaction) => {
  logger.info('Creating admin user...');
  
  // Check if admin user already exists
  const adminUser = await User.findOne({
    where: { email: 'admin@example.com' },
    transaction
  });
  
  if (adminUser) {
    logger.info('Admin user already exists');
    return;
  }
  
  // Create admin user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const user = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
    avatarColor: '#4F46E5'
  }, { transaction });
  
  // Create preferences
  await UserPreference.create({
    userId: user.id,
    difficulty: 'hard',
    dailyGoal: 3
  }, { transaction });
  
  // Create stats
  await UserStats.create({
    userId: user.id,
    problemsSolved: 25,
    streak: 5,
    lastActive: new Date()
  }, { transaction });
  
  // Add themes
  const themes = await Theme.findAll({
    where: { 
      name: ['arrays', 'strings', 'dynamic-programming', 'trees', 'graphs'] 
    },
    transaction
  });
  
  await user.addThemes(themes, { transaction });
  
  logger.info('Admin user created successfully');
};

/**
 * Create demo user if it doesn't exist
 */
const createDemoUser = async (transaction) => {
  logger.info('Creating demo user...');
  
  // Check if demo user already exists
  const demoUser = await User.findOne({
    where: { email: 'demo@example.com' },
    transaction
  });
  
  if (demoUser) {
    logger.info('Demo user already exists');
    return;
  }
  
  // Create demo user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('demo123', salt);
  
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@example.com',
    password: hashedPassword,
    role: 'user',
    avatarColor: '#10B981',
    bio: 'This is a demo account for testing purposes.'
  }, { transaction });
  
  // Create preferences
  await UserPreference.create({
    userId: user.id,
    difficulty: 'medium',
    dailyGoal: 1
  }, { transaction });
  
  // Create stats
  await UserStats.create({
    userId: user.id,
    problemsSolved: 12,
    streak: 3,
    lastActive: new Date()
  }, { transaction });
  
  // Add themes
  const themes = await Theme.findAll({
    where: { 
      name: ['arrays', 'strings', 'linked-lists'] 
    },
    transaction
  });
  
  await user.addThemes(themes, { transaction });
  
  logger.info('Demo user created successfully');
};

/**
 * Main migration function to set up database tables and seed data
 */
const migrate = async () => {
  let transaction;
  
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Create transaction for atomic operations
    transaction = await sequelize.transaction();
    
    // Sync models with database (create tables)
    logger.info('Syncing database models...');
    await sequelize.sync({ transaction });
    
    // Seed data
    await seedThemes(transaction);
    await createAdminUser(transaction);
    await createDemoUser(transaction);
    
    // Commit transaction
    await transaction.commit();
    logger.info('Database migration completed successfully');
    
    // Exit process successfully
    process.exit(0);
  } catch (error) {
    logger.error(`Migration failed: ${error.message}`);
    
    // Rollback transaction if it exists
    if (transaction) {
      await transaction.rollback();
    }
    
    // Log error stack
    logger.error(error.stack);
    
    // Exit with error
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

module.exports = { migrate }; 