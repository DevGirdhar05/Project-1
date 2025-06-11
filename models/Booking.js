const db = require('../server/storage');
const { bookings, users, rooms, hotels } = require('../shared/schema');
const { eq, and, desc, asc, gte, lte, sql, or } = require('drizzle-orm');

class Booking {
  static async create(bookingData) {
    // Convert guestDetails to JSON string if it's an object
    if (bookingData.guestDetails && typeof bookingData.guestDetails === 'object') {
      bookingData.guestDetails = JSON.stringify(bookingData.guestDetails);
    }
    
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return this.formatBooking(booking);
  }

  static async find(filter = {}, options = {}) {
    let query = db.select().from(bookings);
    
    // Apply filters
    const conditions = [];
    if (filter.userId) {
      conditions.push(eq(bookings.userId, filter.userId));
    }
    if (filter.roomId) {
      conditions.push(eq(bookings.roomId, filter.roomId));
    }
    if (filter.hotelId) {
      conditions.push(eq(bookings.hotelId, filter.hotelId));
    }
    if (filter.status) {
      if (Array.isArray(filter.status)) {
        // Handle $in operator
        if (filter.status.$in) {
          const statusConditions = filter.status.$in.map(status => eq(bookings.status, status));
          conditions.push(or(...statusConditions));
        }
      } else if (typeof filter.status === 'object' && filter.status.$in) {
        const statusConditions = filter.status.$in.map(status => eq(bookings.status, status));
        conditions.push(or(...statusConditions));
      } else {
        conditions.push(eq(bookings.status, filter.status));
      }
    }
    if (filter.startDate) {
      if (filter.startDate.$lte) {
        conditions.push(lte(bookings.startDate, filter.startDate.$lte));
      }
      if (filter.startDate.$gte) {
        conditions.push(gte(bookings.startDate, filter.startDate.$gte));
      }
    }
    if (filter.endDate) {
      if (filter.endDate.$gte) {
        conditions.push(gte(bookings.endDate, filter.endDate.$gte));
      }
      if (filter.endDate.$gt) {
        conditions.push(gte(bookings.endDate, filter.endDate.$gt));
      }
      if (filter.endDate.$lte) {
        conditions.push(lte(bookings.endDate, filter.endDate.$lte));
      }
    }
    
    // Handle complex OR conditions for date overlaps
    if (filter.$or) {
      const orConditions = filter.$or.map(condition => {
        const subConditions = [];
        if (condition.startDate) {
          if (condition.startDate.$lte) {
            subConditions.push(lte(bookings.startDate, condition.startDate.$lte));
          }
          if (condition.startDate.$lt) {
            subConditions.push(lte(bookings.startDate, condition.startDate.$lt));
          }
          if (condition.startDate.$gte) {
            subConditions.push(gte(bookings.startDate, condition.startDate.$gte));
          }
        }
        if (condition.endDate) {
          if (condition.endDate.$gt) {
            subConditions.push(gte(bookings.endDate, condition.endDate.$gt));
          }
          if (condition.endDate.$gte) {
            subConditions.push(gte(bookings.endDate, condition.endDate.$gte));
          }
          if (condition.endDate.$lte) {
            subConditions.push(lte(bookings.endDate, condition.endDate.$lte));
          }
        }
        return and(...subConditions);
      });
      conditions.push(or(...orConditions));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0];
      const sortOrder = options.sort[sortField];
      if (sortOrder === 1) {
        query = query.orderBy(asc(bookings[sortField]));
      } else {
        query = query.orderBy(desc(bookings[sortField]));
      }
    }
    
    // Apply pagination
    if (options.skip) {
      query = query.offset(options.skip);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const results = await query;
    return results.map(booking => this.formatBooking(booking));
  }

  static async findById(id) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking ? this.formatBooking(booking) : null;
  }

  static async findByIdAndUpdate(id, updateData) {
    // Convert guestDetails to JSON string if it's an object
    if (updateData.guestDetails && typeof updateData.guestDetails === 'object') {
      updateData.guestDetails = JSON.stringify(updateData.guestDetails);
    }
    
    const [booking] = await db.update(bookings)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking ? this.formatBooking(booking) : null;
  }

  static async findByIdAndDelete(id) {
    const [booking] = await db.delete(bookings).where(eq(bookings.id, id)).returning();
    return booking ? this.formatBooking(booking) : null;
  }

  static async populate(booking, paths) {
    if (!booking) return null;
    
    let result = { ...booking };
    
    if (paths.includes('userId')) {
      const [user] = await db.select({
        id: users.id,
        name: users.name,
        email: users.email
      }).from(users).where(eq(users.id, booking.userId));
      result.userId = user;
    }
    
    if (paths.includes('roomId')) {
      const [room] = await db.select({
        id: rooms.id,
        roomNumber: rooms.roomNumber,
        roomType: rooms.roomType,
        pricePerNight: rooms.pricePerNight,
        amenities: rooms.amenities,
        maxGuests: rooms.maxGuests
      }).from(rooms).where(eq(rooms.id, booking.roomId));
      result.roomId = room;
    }
    
    if (paths.includes('hotelId')) {
      const [hotel] = await db.select({
        id: hotels.id,
        name: hotels.name,
        description: hotels.description,
        location: hotels.location,
        starRating: hotels.starRating,
        contact: hotels.contact
      }).from(hotels).where(eq(hotels.id, booking.hotelId));
      result.hotelId = hotel;
    }
    
    return this.formatBooking(result);
  }

  static async countDocuments(filter = {}) {
    let query = db.select({ count: sql`count(*)` }).from(bookings);
    
    const conditions = [];
    if (filter.roomId) {
      conditions.push(eq(bookings.roomId, filter.roomId));
    }
    if (filter.status) {
      if (typeof filter.status === 'object' && filter.status.$in) {
        const statusConditions = filter.status.$in.map(status => eq(bookings.status, status));
        conditions.push(or(...statusConditions));
      } else {
        conditions.push(eq(bookings.status, filter.status));
      }
    }
    if (filter.endDate && filter.endDate.$gte) {
      conditions.push(gte(bookings.endDate, filter.endDate.$gte));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const [result] = await query;
    return parseInt(result.count);
  }

  static formatBooking(booking) {
    if (!booking) return null;
    
    return {
      ...booking,
      guestDetails: booking.guestDetails ? JSON.parse(booking.guestDetails) : null,
    };
  }
}

module.exports = Booking;