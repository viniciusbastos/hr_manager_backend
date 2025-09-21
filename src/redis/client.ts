import { createClient } from 'redis'

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 5000,
    reconnectStrategy: retries => {
      if (retries > 10) {
        console.error('Too many Redis reconnection attempts')
        return new Error('Too many retries')
      }
      return Math.min(retries * 100, 3000)
    }
  }
})

redisClient.on('error', err => console.error('Redis Client Error:', err))
redisClient.on('connect', () => console.log('Redis Client Connected'))
redisClient.on('ready', () => console.log('Redis Client Ready'))
redisClient.on('reconnecting', () => console.log('Redis Client Reconnecting...'))
// Connect to Redis
redisClient.connect().catch(console.error)

export default redisClient
