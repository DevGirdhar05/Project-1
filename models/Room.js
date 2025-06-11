const db = require('../server/storage');
const { rooms, hotels } = require('../shared/schema');
const { eq, and, desc, asc, gte, lte, sql } = require('drizzle-orm');

class Room {
  static async create(roomData) {
    // Convert arrays to JSON strings
    if (roomData.amenities && Array.isArray(roomData.amenities)) {
      roomData.amenities = JSON.stringify(roomData.amenities);
    }
    if (roomData.images && Array.isArray(roomData.images)) {
      roomData.images = JSON.stringify(roomData.images);
    }
    
    const [room] = await db.insert(rooms).values(roomData).returning();
    return this.formatRoom(room);
  }

  static async find(filter = {}, options = {}) {
    let query = db.select().from(rooms);
    
    // Apply filters
    const conditions = [];
    if (filter.hotelId) {
      conditions.push(eq(rooms.hotelId, filter.hotelId));
    }
    if (filter.isAvailable !== undefined) {
      conditions.push(eq(rooms.isAvailable, filter.isAvailable));
    }
    if (filter.roomType) {
      conditions.push(eq(rooms.roomType, filter.roomType));
    }
    if (filter.pricePerNight) {
      if (filter.pricePerNight.$gte) {
        conditions.push(gte(rooms.pricePerNight, filter.pricePerNight.$gte));
      }
      if (filter.pricePerNight.$lte) {
        conditions.push(lte(rooms.pricePerNight, filter.pricePerNight.$lte));
      }
    }
    if (filter.maxGuests) {
      if (filter.maxGuests.$gte) {
        conditions.push(gte(rooms.maxGuests, filter.maxGuests.$gte));
      }
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0];
      const sortOrder = options.sort[sortField];
      if (sortOrder === 1) {
        query = query.orderBy(asc(rooms[sortField]));
      } else {
        query = query.orderBy(desc(rooms[sortField]));
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
    return results.map(room => this.formatRoom(room));
  }

  static async findById(id) {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room ? this.formatRoom(room) : null;
  }

  static async findByIdAndUpdate(id, updateData) {
    // Convert arrays to JSON strings
    if (updateData.amenities && Array.isArray(updateData.amenities)) {
      updateData.amenities = JSON.stringify(updateData.amenities);
    }
    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images = JSON.stringify(updateData.images);
    }
    
    const [room] = await db.update(rooms)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(rooms.id, id))
      .returning();
    return room ? this.formatRoom(room) : null;
  }

  static async findByIdAndDelete(id) {
    const [room] = await db.delete(rooms).where(eq(rooms.id, id)).returning();
    return room ? this.formatRoom(room) : null;
  }

  static async populate(room, path) {
    if (!room) return null;
    
    if (path === 'hotelId') {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.id, room.hotelId));
      return {
        ...room,
        hotelId: hotel
      };
    }
    
    return room;
  }

  static async countDocuments(filter = {}) {
    let query = db.select({ count: sql`count(*)` }).from(rooms);
    
    const conditions = [];
    if (filter.hotelId) {
      conditions.push(eq(rooms.hotelId, filter.hotelId));
    }
    if (filter.isAvailable !== undefined) {
      conditions.push(eq(rooms.isAvailable, filter.isAvailable));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const [result] = await query;
    return parseInt(result.count);
  }

  static formatRoom(room) {
    if (!room) return null;
    
    return {
      ...room,
      amenities: room.amenities ? JSON.parse(room.amenities) : [],
      images: room.images ? JSON.parse(room.images) : [],
    };
  }
}

module.exports = Room;