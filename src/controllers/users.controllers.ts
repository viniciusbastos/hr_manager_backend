import { Response, Request, RequestHandler } from 'express'
import { body } from 'express-validator'
import { createUser, deleteUser } from '../handlers/userHandlers'
import { handleInputErrors } from '../modules/middleware'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const showUsers: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    const idUnidade = 1
    const user =
      await prisma.$queryRaw`SELECT "User".id, "User".mat, "User"."name", "User".posto, "Unidades"."name" as unidade, "Unidades".id as idUnidade FROM "User" INNER JOIN "Profileunidade" ON "Profileunidade"."belongsToId" = "User".id  INNER JOIN "Unidades" ON "Unidades".id = "Profileunidade"."belongsToUnidadeId"  WHERE "Unidades".id = ${idUnidade} ORDER BY "User"."createdAt"`
    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
}

export const showUser: RequestHandler = async (req, res, next) => {
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
    res.status(200)
    res.json({ user: user })
  } catch (e) {
    next(e)
  }
}
