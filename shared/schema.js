const { pgTable, serial, varchar, text, integer, decimal, boolean, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');

// Enums
const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed']);
const paymentMethodEnum = pgEnum('payment_method', ['credit_card', 'debit_card', 'paypal', 'bank_transfer']);

// Users table
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('user').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Hotels table
const hotels = pgTable('hotels', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  location: text('location').notNull(),
  starRating: integer('star_rating').default(1),
  contact: text('contact'),
  amenities: text('amenities'), // JSON string
  images: text('images'), // JSON string
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Rooms table
const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  hotelId: integer('hotel_id').references(() => hotels.id).notNull(),
  roomNumber: varchar('room_number', { length: 50 }).notNull(),
  roomType: varchar('room_type', { length: 100 }).notNull(),
  description: text('description'),
  pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }).notNull(),
  maxGuests: integer('max_guests').default(2).notNull(),
  amenities: text('amenities'), // JSON string
  images: text('images'), // JSON string
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Bookings table
const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  roomId: integer('room_id').references(() => rooms.id).notNull(),
  hotelId: integer('hotel_id').references(() => hotels.id).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  guests: integer('guests').notNull(),
  guestDetails: text('guest_details'), // JSON string
  specialRequests: text('special_requests'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').default('credit_card').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

const hotelsRelations = relations(hotels, ({ many }) => ({
  rooms: many(rooms),
  bookings: many(bookings),
}));

const roomsRelations = relations(rooms, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [rooms.hotelId],
    references: [hotels.id],
  }),
  bookings: many(bookings),
}));

const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [bookings.roomId],
    references: [rooms.id],
  }),
  hotel: one(hotels, {
    fields: [bookings.hotelId],
    references: [hotels.id],
  }),
}));

module.exports = {
  userRoleEnum,
  bookingStatusEnum,
  paymentMethodEnum,
  users,
  hotels,
  rooms,
  bookings,
  usersRelations,
  hotelsRelations,
  roomsRelations,
  bookingsRelations,
};