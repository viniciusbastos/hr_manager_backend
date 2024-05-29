import { Router } from 'express'
import { body } from 'express-validator'
import { createUser, deleteUser } from '../handlers/userHandlers'
import { handleInputErrors } from '../modules/middleware'
import { showUsers, showUser } from '../controllers/users.controllers'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const usersRouter = Router()


usersRouter.get('/user', showUsers )

usersRouter.get('/user/:id', showUser)

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
usersRouter.post('/user', body('name').isString(), handleInputErrors, createUser)

usersRouter.put('/user/:id', (req, res) => {})

usersRouter.delete('/user/:id', deleteUser)

export default usersRouter;