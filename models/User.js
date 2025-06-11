const db = require('../server/storage');
const { users } = require('../shared/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    // Hash password before saving
    if (userData.password) {
      const salt = await bcrypt.genSalt(12);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  static async findById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  static async findByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  static async findByIdAndUpdate(id, updateData) {
    // Hash password if being updated
    if (updateData.password) {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    
    const [user] = await db.update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  static async findByIdAndDelete(id) {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();
    return user;
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async updateLastLogin(id) {
    await db.update(users)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  static toJSON(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = User;