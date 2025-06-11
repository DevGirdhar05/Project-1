const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { 
  users, 
  hotels, 
  rooms, 
  bookings,
  usersRelations,
  hotelsRelations,
  roomsRelations,
  bookingsRelations
} = require('../shared/schema');

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/hotel_booking';
const client = postgres(connectionString);
const db = drizzle(client, {
  schema: {
    users,
    hotels,
    rooms,
    bookings,
    usersRelations,
    hotelsRelations,
    roomsRelations,
    bookingsRelations,
  },
});

module.exports = db;