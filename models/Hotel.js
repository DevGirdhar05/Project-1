const db = require('../server/storage');
const { hotels } = require('../shared/schema');
const { eq, and, desc, asc, like, sql } = require('drizzle-orm');

class Hotel {
  static async create(hotelData) {
    // Convert arrays to JSON strings
    if (hotelData.amenities && Array.isArray(hotelData.amenities)) {
      hotelData.amenities = JSON.stringify(hotelData.amenities);
    }
    if (hotelData.images && Array.isArray(hotelData.images)) {
      hotelData.images = JSON.stringify(hotelData.images);
    }
    
    const [hotel] = await db.insert(hotels).values(hotelData).returning();
    return this.formatHotel(hotel);
  }

  static async find(filter = {}, options = {}) {
    let query = db.select().from(hotels);
    
    // Apply filters
    const conditions = [];
    if (filter.isActive !== undefined) {
      conditions.push(eq(hotels.isActive, filter.isActive));
    }
    if (filter.location) {
      conditions.push(like(hotels.location, `%${filter.location}%`));
    }
    if (filter.starRating) {
      conditions.push(eq(hotels.starRating, filter.starRating));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0];
      const sortOrder = options.sort[sortField];
      if (sortOrder === 1) {
        query = query.orderBy(asc(hotels[sortField]));
      } else {
        query = query.orderBy(desc(hotels[sortField]));
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
    return results.map(hotel => this.formatHotel(hotel));
  }

  static async findById(id) {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel ? this.formatHotel(hotel) : null;
  }

  static async findByIdAndUpdate(id, updateData) {
    // Convert arrays to JSON strings
    if (updateData.amenities && Array.isArray(updateData.amenities)) {
      updateData.amenities = JSON.stringify(updateData.amenities);
    }
    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images = JSON.stringify(updateData.images);
    }
    
    const [hotel] = await db.update(hotels)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(hotels.id, id))
      .returning();
    return hotel ? this.formatHotel(hotel) : null;
  }

  static async findByIdAndDelete(id) {
    const [hotel] = await db.delete(hotels).where(eq(hotels.id, id)).returning();
    return hotel ? this.formatHotel(hotel) : null;
  }

  static async countDocuments(filter = {}) {
    let query = db.select({ count: sql`count(*)` }).from(hotels);
    
    const conditions = [];
    if (filter.isActive !== undefined) {
      conditions.push(eq(hotels.isActive, filter.isActive));
    }
    if (filter.location) {
      conditions.push(like(hotels.location, `%${filter.location}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const [result] = await query;
    return parseInt(result.count);
  }

  static formatHotel(hotel) {
    if (!hotel) return null;
    
    return {
      ...hotel,
      amenities: hotel.amenities ? JSON.parse(hotel.amenities) : [],
      images: hotel.images ? JSON.parse(hotel.images) : [],
    };
  }
}

module.exports = Hotel;