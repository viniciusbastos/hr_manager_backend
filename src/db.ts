import { PrismaClient } from '@prisma/client'
import { PrismaExtensionRedis, CacheCase } from 'prisma-extension-redis'

// Define interfaces for better type safety
interface RedisConfig {
  host: string
  port: number
  password?: string
}

// Validate and extract environment variables
const REDIS_HOST = process.env.REDIS_HOST_NAME
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10)
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '120', 10)

if (!REDIS_HOST) {
  throw new Error('REDIS_HOST_NAME environment variable is required for Redis configuration.')
}

if (isNaN(REDIS_PORT) || REDIS_PORT <= 0 || REDIS_PORT > 65535) {
  throw new Error('REDIS_PORT must be a valid port number between 1 and 65535.')
}

// Redis client configuration
const redisConfig: RedisConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT
}

// Cache configuration
const cacheConfig = {
  type: 'JSON' as const,
  cacheKey: {
    delimiter: ':',
    case: CacheCase.CAMEL_CASE,
    prefix: 'prisma'
  },
  ttl: CACHE_TTL,
  stale: 0,
  auto: {
    models: [
      { model: 'User', ttl: CACHE_TTL },
      { model: 'Weapon', ttl: CACHE_TTL }
    ]
  }
}

// Initialize Prisma client
const prisma = new PrismaClient()

// Create Redis extension with error handling
let extension
try {
  extension = PrismaExtensionRedis({
    client: redisConfig,
    config: cacheConfig
  })
  console.log('Redis extension initialized successfully.')
} catch (error) {
  console.error('Failed to initialize Redis extension:', error)
  // Fallback: Use Prisma without caching if Redis fails
  extension = {} // Empty extension as fallback
}

// Extend Prisma with the Redis extension
const extendedPrisma = prisma.$extends(extension)

// Export the extended Prisma client
export default extendedPrisma
