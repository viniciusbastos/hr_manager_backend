import { Router } from 'express'
import { body } from 'express-validator'
import { createUser, deleteUser } from '../handlers/userHandlers'
import { handleInputErrors } from '../modules/middleware'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const usersRouter = Router()


usersRouter.get('/user', async (req, res, next) => {
  try {
    const idUnidade = 1
    const user = await prisma.$queryRaw`SELECT "User".id, "User".mat, "User"."name", "User".posto, "Unidades"."name" as unidade, "Unidades".id as idUnidade FROM "User" INNER JOIN "Profileunidade" ON "Profileunidade"."belongsToId" = "User".id  INNER JOIN "Unidades" ON "Unidades".id = "Profileunidade"."belongsToUnidadeId"  WHERE "Unidades".id = ${idUnidade} ORDER BY "User"."createdAt"`
    res.json(user)
  } catch (e) {
    next(e)
  }
})

usersRouter.get('/user/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const user: any = await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        Vacation: true,
        profile: true
      }
    })
    res.json({ user: user })
  } catch (e) {
    next(e)
  }
})

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