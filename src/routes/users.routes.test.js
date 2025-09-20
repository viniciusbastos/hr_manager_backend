import request from 'supertest'
import express from 'express'
import usersRouter from './users.routes.js'
import prisma from '../db.js'
import extendedPrisma from '../db.js'

// Mock the database
jest.mock('../db.js', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    profile: {
      update: jest.fn(),
      create: jest.fn()
    },
    $queryRaw: jest.fn()
  },
  extendedPrisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn()
    },
    profile: {
      update: jest.fn(),
      create: jest.fn()
    },
    $queryRaw: jest.fn()
  }
}))

const app = express()
app.use(express.json())
app.use('/api', usersRouter)

describe('Users Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/user', () => {
    it('should return all users from unidade 1', async () => {
      const mockUsers = [
        {
          id: '1',
          mat: '12345',
          name: 'João Silva',
          posto: 'Soldado',
          unidade: '1ª Cia',
          role: 'USER',
          idUnidade: 1
        }
      ]

      extendedPrisma.$queryRaw.mockResolvedValue(mockUsers)

      const response = await request(app)
        .get('/api/user')
        .expect(200)

      expect(response.body).toEqual(mockUsers)
      expect(extendedPrisma.$queryRaw).toHaveBeenCalledWith(
        expect.stringContaining('WHERE "Unidades".id = 1')
      )
    })

    it('should handle database errors', async () => {
      extendedPrisma.$queryRaw.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .get('/api/user')
        .expect(500)
    })
  })

  describe('GET /api/user/:id', () => {
    it('should return a specific user with profile', async () => {
      const mockUser = {
        id: '1',
        name: 'João Silva',
        posto: 'Soldado',
        mat: '12345',
        profile: [
          {
            phone: '999999999',
            address: 'Rua A, 123'
          }
        ]
      }

      extendedPrisma.user.findUnique.mockResolvedValue(mockUser)

      const response = await request(app)
        .get('/api/user/1')
        .expect(200)

      expect(response.body).toEqual({ user: mockUser })
      expect(extendedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          profile: {
            select: {
              phone: true,
              address: true
            }
          }
        }
      })
    })

    it('should return 404 if user not found', async () => {
      extendedPrisma.user.findUnique.mockResolvedValue(null)

      const response = await request(app)
        .get('/api/user/999')
        .expect(404)

      expect(response.body).toEqual({ message: 'User not found' })
    })

    it('should handle database errors', async () => {
      extendedPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .get('/api/user/1')
        .expect(500)
    })
  })

  describe('GET /api/user/search/:mat', () => {
    it('should search user by matricula', async () => {
      const mockUser = [
        {
          id: '1',
          name: 'João Silva',
          posto: 'Soldado',
          mat: '12345'
        }
      ]

      extendedPrisma.$queryRaw.mockResolvedValue(mockUser)

      const response = await request(app)
        .get('/api/user/search/12345')
        .expect(200)

      expect(response.body).toEqual({ user: mockUser })
      expect(extendedPrisma.$queryRaw).toHaveBeenCalledWith(
        expect.stringContaining('WHERE "mat" LIKE')
      )
    })

    it('should handle search errors', async () => {
      extendedPrisma.$queryRaw.mockRejectedValue(new Error('Search error'))

      const response = await request(app)
        .get('/api/user/search/12345')
        .expect(500)
    })
  })

  describe('POST /api/user', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'João Silva',
        posto: 'Soldado',
        mat: '12345',
        email: 'joao@example.com'
      }

      const mockCreatedUser = {
        id: '1',
        ...userData
      }

      prisma.user.create.mockResolvedValue(mockCreatedUser)

      const response = await request(app)
        .post('/api/user')
        .send(userData)
        .expect(200)

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          posto: userData.posto,
          mat: userData.mat,
          email: userData.email,
          Profileunidade: {
            create: {
              belongsToUnidadeId: 1
            }
          }
        }
      })
    })

    it('should handle creation errors', async () => {
      prisma.user.create.mockRejectedValue(new Error('Creation error'))

      const response = await request(app)
        .post('/api/user')
        .send({
          name: 'João Silva',
          posto: 'Soldado',
          mat: '12345',
          email: 'joao@example.com'
        })
        .expect(500)
    })
  })

  describe('PUT /api/edituser/:id', () => {
    it('should update user and profile', async () => {
      const updateData = {
        name: 'João Silva Atualizado',
        phone: '999999999',
        address: 'Rua B, 456'
      }

      const mockUser = {
        id: '1',
        name: 'João Silva Atualizado',
        profile: [{ id: 1 }]
      }

      const mockUpdatedUser = {
        id: '1',
        name: 'João Silva Atualizado',
        profile: [
          {
            phone: '999999999',
            address: 'Rua B, 456'
          }
        ]
      }

      extendedPrisma.user.update.mockResolvedValue(mockUser)
      extendedPrisma.profile.update.mockResolvedValue({})
      extendedPrisma.user.findUnique.mockResolvedValue(mockUpdatedUser)

      const response = await request(app)
        .put('/api/edituser/1')
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual({ user: mockUpdatedUser })
      expect(extendedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'João Silva Atualizado' },
        include: { profile: true }
      })
    })

    it('should create profile if it does not exist', async () => {
      const updateData = {
        name: 'João Silva',
        phone: '999999999'
      }

      const mockUser = {
        id: '1',
        name: 'João Silva',
        profile: [] // No existing profile
      }

      extendedPrisma.user.update.mockResolvedValue(mockUser)
      extendedPrisma.profile.create.mockResolvedValue({})
      extendedPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        name: 'João Silva',
        profile: [{ phone: '999999999' }]
      })

      const response = await request(app)
        .put('/api/edituser/1')
        .send(updateData)
        .expect(200)

      expect(extendedPrisma.profile.create).toHaveBeenCalledWith({
        data: {
          phone: '999999999',
          belongsToId: '1'
        }
      })
    })

    it('should handle update errors', async () => {
      extendedPrisma.user.update.mockRejectedValue(new Error('Update error'))

      const response = await request(app)
        .put('/api/edituser/1')
        .send({ name: 'João Silva' })
        .expect(500)
    })
  })

  describe('DELETE /api/user/:id', () => {
    it('should delete a user', async () => {
      const mockDeletedUser = {
        id: '1',
        name: 'João Silva'
      }

      prisma.user.delete.mockResolvedValue(mockDeletedUser)

      const response = await request(app)
        .delete('/api/user/1')
        .expect(200)

      expect(response.body).toEqual({ data: mockDeletedUser })
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })

    it('should handle deletion errors', async () => {
      prisma.user.delete.mockRejectedValue(new Error('Deletion error'))

      const response = await request(app)
        .delete('/api/user/1')
        .expect(500)
    })
  })
})