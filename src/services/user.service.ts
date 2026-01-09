import database from '../config/database';
import logger from '../utils/logger';

export interface User {
  id: string;
  firebaseUid: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  name: string;
  age?: number;
  profilePictureUrl?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  firebaseUid: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
}

export interface UpdateUserData {
  username?: string;
  phoneNumber?: string;
  name?: string;
  age?: number;
  profilePictureUrl?: string;
  bio?: string;
  status?: 'online' | 'offline' | 'away';
}

class UserService {
  /**
   * Generate a unique username from email or name
   */
  private async generateUniqueUsername(email: string, name: string): Promise<string> {
    // Extract base username from email (before @) or name
    let baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // If email-based username is too short or empty, use name
    if (baseUsername.length < 3) {
      baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
    }
    
    // Ensure minimum length
    if (baseUsername.length < 3) {
      baseUsername = 'user' + Math.random().toString(36).substring(2, 8);
    }
    
    // Ensure maximum length
    if (baseUsername.length > 27) {
      baseUsername = baseUsername.substring(0, 27);
    }
    
    // Check if username is available
    let username = baseUsername;
    let counter = 1;
    
    while (!(await this.isUsernameAvailable(username))) {
      const suffix = counter.toString();
      const maxLength = 30 - suffix.length;
      username = baseUsername.substring(0, maxLength) + suffix;
      counter++;
      
      // Safety check to prevent infinite loop
      if (counter > 10000) {
        username = 'user' + Date.now().toString().substring(7);
        break;
      }
    }
    
    return username;
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<User> {
    try {
      // Generate a unique username
      const username = await this.generateUniqueUsername(data.email, data.name);
      
      // Default age to 18 (user can update later via complete-profile)
      // Database requires age >= 13, so we use 18 as a safe default
      const defaultAge = 18;
      
      const result = await database.query<User>(
        `INSERT INTO users (
          firebase_uid, username, email, name, age, profile_picture_url, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING 
          id, firebase_uid as "firebaseUid", username, email,
          phone_number as "phoneNumber", name, age,
          profile_picture_url as "profilePictureUrl", bio,
          status, last_seen as "lastSeen", is_active as "isActive",
          created_at as "createdAt", updated_at as "updatedAt"`,
        [data.firebaseUid, username, data.email, data.name, defaultAge, data.profilePictureUrl || null, 'offline']
      );

      const user = result.rows[0];

      logger.info('User created successfully', {
        userId: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
      });

      return user;
    } catch (error) {
      logger.error('Failed to create user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        firebaseUid: data.firebaseUid,
      });
      throw error;
    }
  }

  /**
   * Get user by Firebase UID
   */
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    try {
      const result = await database.query<User>(
        `SELECT 
          id, firebase_uid as "firebaseUid", username, email,
          phone_number as "phoneNumber", name, age,
          profile_picture_url as "profilePictureUrl", bio,
          status, last_seen as "lastSeen", is_active as "isActive",
          created_at as "createdAt", updated_at as "updatedAt"
        FROM users
        WHERE firebase_uid = $1 AND is_active = true
        LIMIT 1`,
        [firebaseUid]
      );

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Failed to get user by Firebase UID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        firebaseUid,
      });
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const result = await database.query<User>(
        `SELECT 
          id, firebase_uid as "firebaseUid", username, email,
          phone_number as "phoneNumber", name, age,
          profile_picture_url as "profilePictureUrl", bio,
          status, last_seen as "lastSeen", is_active as "isActive",
          created_at as "createdAt", updated_at as "updatedAt"
        FROM users
        WHERE id = $1 AND is_active = true
        LIMIT 1`,
        [userId]
      );

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Failed to get user by ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const result = await database.query(
        'SELECT 1 FROM users WHERE username = $1 AND is_active = true LIMIT 1',
        [username.toLowerCase()]
      );

      return result.rowCount === 0;
    } catch (error) {
      logger.error('Failed to check username availability', {
        error: error instanceof Error ? error.message : 'Unknown error',
        username,
      });
      throw error;
    }
  }

  /**
   * Check if phone number is available
   */
  async isPhoneAvailable(phoneNumber: string): Promise<boolean> {
    try {
      const result = await database.query(
        'SELECT 1 FROM users WHERE phone_number = $1 AND is_active = true LIMIT 1',
        [phoneNumber]
      );

      return result.rowCount === 0;
    } catch (error) {
      logger.error('Failed to check phone availability', {
        error: error instanceof Error ? error.message : 'Unknown error',
        phoneNumber,
      });
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (data.username !== undefined) {
        updates.push(`username = $${paramIndex}`);
        values.push(data.username.toLowerCase());
        paramIndex++;
      }

      if (data.phoneNumber !== undefined) {
        updates.push(`phone_number = $${paramIndex}`);
        values.push(data.phoneNumber || null);
        paramIndex++;
      }

      if (data.name !== undefined) {
        updates.push(`name = $${paramIndex}`);
        values.push(data.name);
        paramIndex++;
      }

      if (data.age !== undefined) {
        updates.push(`age = $${paramIndex}`);
        values.push(data.age);
        paramIndex++;
      }

      if (data.profilePictureUrl !== undefined) {
        updates.push(`profile_picture_url = $${paramIndex}`);
        values.push(data.profilePictureUrl || null);
        paramIndex++;
      }

      if (data.bio !== undefined) {
        updates.push(`bio = $${paramIndex}`);
        values.push(data.bio || null);
        paramIndex++;
      }

      if (data.status !== undefined) {
        updates.push(`status = $${paramIndex}`);
        values.push(data.status);
        paramIndex++;
      }

      if (updates.length === 0) {
        return (await this.getUserById(userId))!;
      }

      values.push(userId);

      const result = await database.query<User>(
        `UPDATE users 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex} AND is_active = true
        RETURNING 
          id, firebase_uid as "firebaseUid", username, email,
          phone_number as "phoneNumber", name, age,
          profile_picture_url as "profilePictureUrl", bio,
          status, last_seen as "lastSeen", is_active as "isActive",
          created_at as "createdAt", updated_at as "updatedAt"`,
        values
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Failed to update user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Update user last seen timestamp
   */
  async updateLastSeen(userId: string): Promise<void> {
    try {
      await database.query(
        'UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = $1',
        [userId]
      );
    } catch (error) {
      logger.error('Failed to update last seen', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;
