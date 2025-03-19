const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');

/**
 * User Model for MySQL
 * Using Sequelize ORM with optimized indexes for thousands of users
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name is required'
      },
      len: {
        args: [2, 50],
        msg: 'Name must be between 2 and 50 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'Password must be at least 6 characters'
      }
    }
  },
  avatarColor: {
    type: DataTypes.STRING(10),
    defaultValue: '#4F46E5'
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: '',
    validate: {
      len: {
        args: [0, 200],
        msg: 'Bio cannot be more than 200 characters'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastActive: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  // Sequelize options
  tableName: 'users',
  timestamps: true, // Creates createdAt and updatedAt automatically
  indexes: [
    // Add indexes for frequently queried fields
    { 
      unique: true, 
      fields: ['email'] 
    },
    { 
      fields: ['lastActive'] 
    },
    {
      fields: ['role']
    }
  ],
  // Hide password from JSON results
  defaultScope: {
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] }
  },
  scopes: {
    // Scope for when we need to include password
    withPassword: {
      attributes: { exclude: ['resetPasswordToken', 'resetPasswordExpire'] }
    }
  }
});

/**
 * Preferences Model for storing user preferences
 */
const UserPreference = sequelize.define('UserPreference', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  },
  dailyGoal: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Daily goal must be at least 1'
      },
      max: {
        args: [20],
        msg: 'Daily goal cannot be more than 20'
      }
    }
  }
});

/**
 * UserTheme Model for storing user preferred themes (many-to-many)
 */
const Theme = sequelize.define('Theme', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

/**
 * UserStats Model for storing user statistics
 */
const UserStats = sequelize.define('UserStats', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  easyProblemsSolved: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  mediumProblemsSolved: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  hardProblemsSolved: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalProblemsSolved: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  submissions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  activeDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  maxStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Define relationships
User.hasOne(UserPreference, { 
  foreignKey: 'userId',
  as: 'preferences',
  onDelete: 'CASCADE'
});
UserPreference.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(UserStats, { 
  foreignKey: 'userId',
  as: 'stats',
  onDelete: 'CASCADE'
});
UserStats.belongsTo(User, { foreignKey: 'userId' });

// Many-to-many for users and themes
const UserTheme = sequelize.define('UserTheme', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  themeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'themes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'user_themes',
  timestamps: false,
  indexes: [{ fields: ['userId', 'themeId'] }]
});

User.belongsToMany(Theme, { 
  through: UserTheme,
  foreignKey: 'userId',
  as: 'themes'
});
Theme.belongsToMany(User, { 
  through: UserTheme,
  foreignKey: 'themeId'
});

// Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Method to check if password is correct
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
User.prototype.generateAuthToken = function() {
  const payload = {
    id: this.id,
    email: this.email,
    role: this.role
  };
  
  // Sign the token with our secret key (typically expires in 1 day)
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1d'
  });
};

// Create instance methods to handle user preferences and themes
User.prototype.getPreferencesWithThemes = async function() {
  const preferences = await this.getPreferences();
  const themes = await this.getThemes();
  
  return {
    ...preferences.toJSON(),
    themes: themes.map(theme => theme.name)
  };
};

module.exports = { 
  User,
  UserPreference,
  UserStats,
  Theme,
  UserTheme
}; 