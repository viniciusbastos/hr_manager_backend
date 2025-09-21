import { Request, Response, NextFunction } from 'express'
import { CacheService, CacheTTL } from '../redis/cache.utils'

interface CacheOptions {
  ttl?: number
  keyGenerator?: (req: Request) => string
  condition?: (req: Request) => boolean
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests by default
    if (req.method !== 'GET') {
      return next()
    }

    // Check custom condition
    if (options.condition && !options.condition(req)) {
      return next()
    }

    // Generate cache key
    const cacheKey = options.keyGenerator
      ? options.keyGenerator(req)
      : CacheService.generateKey('api', req.originalUrl)

    try {
      // Try to get from cache
      const cachedData = await CacheService.get(cacheKey)

      if (cachedData) {
        console.log(`Cache hit: ${cacheKey}`)
        res.setHeader('X-Cache', 'HIT')
        return res.json(cachedData)
      }

      console.log(`Cache miss: ${cacheKey}`)
      res.setHeader('X-Cache', 'MISS')

      // Store original send function
      const originalSend = res.json.bind(res)

      // Override json function to cache the response
      res.json = function (data: any) {
        // Cache the successful response
        if (res.statusCode === 200) {
          CacheService.set(cacheKey, data, options.ttl || CacheTTL.MEDIUM).catch(err =>
            console.error('Failed to cache response:', err)
          )
        }

        return originalSend(data)
      }

      next()
    } catch (error) {
      console.error('Cache middleware error:', error)
      next()
    }
  }
}

// Middleware to invalidate cache for mutations
export const invalidateCacheMiddleware = (patterns: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original send functions
    const originalJson = res.json.bind(res)
    const originalSend = res.send.bind(res)

    const invalidateCache = async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        for (const pattern of patterns) {
          await CacheService.delPattern(pattern)
        }
      }
    }

    res.json = function (data: any) {
      invalidateCache().catch(console.error)
      return originalJson(data)
    }

    res.send = function (data: any) {
      invalidateCache().catch(console.error)
      return originalSend(data)
    }

    next()
  }
}
