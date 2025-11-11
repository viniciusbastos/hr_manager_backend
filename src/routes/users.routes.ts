import { Router } from 'express'
import { body } from 'express-validator'
import { createUser, deleteUser } from '../handlers/userHandlers.js'
import { handleInputErrors } from '../modules/middleware.js'
import { showUsers, showUser, editUser } from '../controllers/users.controllers.js'
import prisma from '../db.js'
import { cacheMiddleware, invalidateCacheMiddleware } from '../middleware/cache.middleware.js'

const usersRouter = Router()

// GET /user - Retrieve all users with caching
usersRouter.get('/user', cacheMiddleware(), showUsers)

// GET /user/:id - Retrieve a specific user by ID with caching
usersRouter.get('/user/:id', cacheMiddleware(), showUser)

// GET /user/search/:mat - Search users by mat number
usersRouter.get('/user/search/:mat', async (req, res, next) => {
  try {
    const { mat } = req.params
    const user: any =
      await prisma.$queryRaw`SELECT "User".id, "User"."name", "User".posto, "User".mat FROM "User" WHERE "mat" LIKE ${mat} `

    res.json({ user: user })
  } catch (e) {
    next(e)
  }
})

// POST /user - Create a new user
usersRouter.post('/user', handleInputErrors, invalidateCacheMiddleware(['/api/user*']), createUser)

// PUT /edituser/:id - Update an existing user
usersRouter.put('/edituser/:id',
  body('name').optional().isString().trim().isLength({ min: 1 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('posto').optional().isString().trim(),
  body('role').optional().isIn(['USER', 'ADMIN', 'GUEST']),
  body('phone').optional().isString().trim().isLength({ min: 1 }),
  body('address').optional().isString().trim().isLength({ min: 1 }),
  handleInputErrors,
  invalidateCacheMiddleware(['/api/user*']),
  editUser)

// DELETE /user/:id - Delete a user
usersRouter.delete('/user/:id', invalidateCacheMiddleware(['/api/user*']), deleteUser)

usersRouter.get('/efetivo', cacheMiddleware(), async (req, res) => {
  const user =
    await prisma.$queryRaw` SELECT "User".posto, COUNT(*)::int as qtd FROM "User" INNER JOIN "Profileunidade" ON "Profileunidade"."belongsToId" = "User".id  WHERE "Profileunidade"."belongsToUnidadeId" = 1 GROUP BY "User".posto`

  res.json(user)
})

export default usersRouter
