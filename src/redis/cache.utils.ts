import redisClient from './client'

export const CacheTTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800 // 7 days
}

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key)
      if (!data) return null
      const dataStr = typeof data === 'string' ? data : data.toString()
      return JSON.parse(dataStr)
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  static async set(key: string, value: any, ttl: number = CacheTTL.MEDIUM): Promise<boolean> {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  static async del(key: string | string[]): Promise<boolean> {
    try {
      if (Array.isArray(key)) {
        await redisClient.del(key)
      } else {
        await redisClient.del(key)
      }
      return true
    } catch (error) {
      console.error(`Cache delete error:`, error)
      return false
    }
  }

  static async delPattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redisClient.keys(pattern)
      if (keys.length > 0) {
        await redisClient.del(keys)
      }
      return true
    } catch (error) {
      console.error(`Cache delete pattern error:`, error)
      return false
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key)
      return result === 1
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error)
      return false
    }
  }

  static async flush(): Promise<boolean> {
    try {
      await redisClient.flushAll()
      return true
    } catch (error) {
      console.error('Cache flush error:', error)
      return false
    }
  }

  static generateKey(...parts: (string | number)[]): string {
    return parts.join(':')
  }
}
