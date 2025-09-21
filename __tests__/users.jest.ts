import request from 'supertest'
import app from '../src/server'
import { PrismaClient } from '@prisma/client'
import redisClient from '../src/redis/client'

jest.mock('@prisma/client')
jest.mock('../src/redis/client.js')

const MockedPrismaClient = PrismaClient as jest.Mock<PrismaClient>
const mockedRedisClient = redisClient as jest.Mocked<typeof redisClient>

describe('Users Router', () => {
  let mockPrisma: any

  beforeEach(() => {
    mockPrisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      $queryRaw: jest.fn()
    }
    MockedPrismaClient.mockImplementation(() => mockPrisma)

    mockedRedisClient.get.mockResolvedValue(null)
    mockedRedisClient.setEx.mockResolvedValue('OK')
    mockedRedisClient.del.mockResolvedValue(1)
    mockedRedisClient.keys.mockResolvedValue([])
    Object.defineProperty(mockedRedisClient, 'isReady', { get: () => true })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/user', () => {
    it('should return a list of users', async () => {
      const mockUsers = [{ id: '1', name: 'Test User' }]
      mockPrisma.$queryRaw.mockResolvedValue(mockUsers)

      const response = await request(app).get('/api/user')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockUsers)
      expect(response.headers['x-cache']).toBe('MISS')
      expect(mockPrisma.$queryRaw).toHaveBeenCalled()
      expect(mockedRedisClient.get).toHaveBeenCalledWith('api:/api/user')
      expect(mockedRedisClient.setEx).toHaveBeenCalled()
    })

    it('should return cached data on second request', async () => {
      const mockUsers = [{ id: '1', name: 'Test User' }]
      mockedRedisClient.get.mockResolvedValue(JSON.stringify(mockUsers)) // Cache hit

      const response = await request(app).get('/api/user')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockUsers)
      expect(response.headers['x-cache']).toBe('HIT')
      expect(mockPrisma.$queryRaw).not.toHaveBeenCalled()
      expect(mockedRedisClient.get).toHaveBeenCalledWith('api:/api/user')
    })
  })

  describe('GET /api/user/:id', () => {
    it('should return a single user', async () => {
      const mockUser = { id: '1', name: 'Test User' }
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const response = await request(app).get('/api/user/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockUser)
      expect(response.headers['x-cache']).toBe('MISS')
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' }, include: { profile: { select: { phone: true, address: true } } } })
      expect(mockedRedisClient.get).toHaveBeenCalledWith('api:/api/user/1')
      expect(mockedRedisClient.setEx).toHaveBeenCalled()
    })

    it('should return cached data on second request for a single user', async () => {
      const mockUser = { id: '1', name: 'Test User' }
      mockedRedisClient.get.mockResolvedValue(JSON.stringify(mockUser)) // Cache hit

      const response = await request(app).get('/api/user/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockUser)
      expect(response.headers['x-cache']).toBe('HIT')
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
      expect(mockedRedisClient.get).toHaveBeenCalledWith('api:/api/user/1')
    })
  })

  describe('POST /api/user', () => {
    it('should create a user and invalidate the cache', async () => {
      const newUser = { name: 'New User', email: 'new@test.com', password: 'password' }
      const createdUser = { id: '2', ...newUser }
      mockPrisma.user.create.mockResolvedValue(createdUser)
      mockedRedisClient.keys.mockResolvedValue(['api:/api/user'])

      const response = await request(app).post('/api/user').send(newUser)

      expect(response.status).toBe(201)
      expect(mockPrisma.user.create).toHaveBeenCalled()
      expect(mockedRedisClient.keys).toHaveBeenCalledWith('/api/user*')
      expect(mockedRedisClient.del).toHaveBeenCalledWith(['api:/api/user'])
    })
  })

  describe('PUT /api/edituser/:id', () => {
    it('should update a user and invalidate the cache', async () => {
      const updatedUser = { id: '1', name: 'Updated User' }
      mockPrisma.user.update.mockResolvedValue(updatedUser)
      mockPrisma.user.findUnique.mockResolvedValue(updatedUser)
      mockedRedisClient.keys.mockResolvedValue(['api:/api/user', 'api:/api/user/1'])

      const response = await request(app).put('/api/edituser/1').send({ name: 'Updated User' })

      expect(response.status).toBe(200)
      expect(mockPrisma.user.update).toHaveBeenCalled()
      expect(mockedRedisClient.del).toHaveBeenCalledWith('api:/api/user/1')
    })
  })

  describe('DELETE /api/user/:id', () => {
    it('should delete a user and invalidate the cache', async () => {
      const deletedUser = { id: '1' }
      mockPrisma.user.delete.mockResolvedValue(deletedUser)
      mockedRedisClient.keys.mockResolvedValue(['api:/api/user', 'api:/api/user/1'])

      const response = await request(app).delete('/api/user/1')

      expect(response.status).toBe(200)
      expect(mockPrisma.user.delete).toHaveBeenCalled()
      expect(mockedRedisClient.keys).toHaveBeenCalledWith('/api/user*')
      expect(mockedRedisClient.del).toHaveBeenCalledWith(['api:/api/user', 'api:/api/user/1'])
    })
  })
})