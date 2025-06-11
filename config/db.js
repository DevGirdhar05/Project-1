const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

const connectDB = async () => {
  try {
    const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/hotel_booking';
    
    // Test the connection
    const client = postgres(connectionString);
    await client`SELECT 1`;
    
    console.log('PostgreSQL Connected successfully');
    return client;
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
