const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log("Database connection test starting...");
console.log("==================================");
console.log("Environment variables:");
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]'}`);
console.log("==================================");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function testConnection() {
  let client;
  try {
    console.log("Attempting to connect to database...");
    client = await pool.connect();
    console.log("✅ Successfully connected to the database!");

    // Test if the users table exists
    console.log("Checking if users table exists...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log("✅ Users table exists");
      
      // Test user count
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log(`Current user count: ${userCount.rows[0].count}`);

      // Try creating a test user
      console.log("Attempting to create a test user...");
      
      // First check if test user exists
      const userExists = await client.query(
        'SELECT * FROM users WHERE email = $1',
        ['test@example.com']
      );
      
      if (userExists.rows.length > 0) {
        console.log("Test user already exists");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        const result = await client.query(
          'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id, email, username',
          ['test@example.com', hashedPassword, 'testuser']
        );
        
        console.log("✅ Test user created successfully:", result.rows[0]);
      }
    } else {
      console.log("❌ Users table does not exist. Running schema...");
      
      // Create users table if it doesn't exist
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          username VARCHAR(50) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log("✅ Users table created");
      
      // Try creating a test user
      console.log("Attempting to create a test user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const result = await client.query(
        'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id, email, username',
        ['test@example.com', hashedPassword, 'testuser']
      );
      
      console.log("✅ Test user created successfully:", result.rows[0]);
    }
    
  } catch (error) {
    console.error("❌ Database connection error:", error);
  } finally {
    if (client) {
      client.release();
      console.log("Database connection released");
    }
    await pool.end();
    console.log("Connection pool ended");
  }
}

testConnection(); 