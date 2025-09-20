import { PrismaClient } from '@prisma/client'

import { createClient } from 'redis'

// Validate and extract environment variables
const REDIS_HOST = process.env.REDIS_HOST_NAME || 'localhost'
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10)


if (isNaN(REDIS_PORT) || REDIS_PORT <= 0 || REDIS_PORT > 65535) {
  throw new Error('REDIS_PORT must be a valid port number between 1 and 65535.')
}

// Initialize Redis client
const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
})

redisClient.on('error', err => console.error('Redis Client Error', err))
redisClient.on('connect', () => console.log('Connected to Redis'))

// Connect to Redis
redisClient.connect().catch(console.error)

// Initialize Prisma client
const prisma = new PrismaClient()

// Export Prisma client and Redis client
export default prisma
export const extendedPrisma = prisma
export { redisClient }
