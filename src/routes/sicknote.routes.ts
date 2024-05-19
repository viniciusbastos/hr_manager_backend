import { Router } from 'express'
import { body } from 'express-validator'
import { createUser, deleteUser } from '../handlers/userHandlers'
import { handleInputErrors } from '../modules/middleware'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const sicknoteRouter = Router()


//Atestados Médicos

sicknoteRouter.get('/sicknote', async (req, res) => {
    const courses: any = await prisma.sicknote.findMany({})
    res.json({ courses })
  })
  
  sicknoteRouter.get('/sicknote/:id', async (req, res) => {
    const { id } = req.params
    const sicknote: any = await prisma.sicknote.findMany({
      where: {
        belongsToId: id
      }
    })
    res.json({ sicknote })
  })
  sicknoteRouter.get('/sicknote/month/:month', async (req, res) => {
    const { month } = req.params
    const intMonth = parseInt(month)
    const sicknote: any =
      await prisma.$queryRaw`SELECT "User".id, "User"."name", "User".posto, "User".mat, "sicknote"."month","sicknote"."year", "sicknote"."period", "sicknote"."startAt", "sicknote"."finishAt" FROM "User" INNER join "sicknote" ON "User".id = "sicknote"."belongsToId" WHERE "sicknote"."month" = ${intMonth}`
    res.json({ sicknote })
  })
  
  sicknoteRouter.get('/sicknote/quantity', async (req, res) => {
    const sicknote: any =
      await prisma.$queryRaw`SELECT  COUNT(*) FROM "sicknote" WHERE "sicknote"."month" =  date_part('month', (SELECT current_timestamp)) aND  "sicknote"."year" =   date_part('year', (SELECT current_timestamp))  GROUP BY "sicknote"."month"`
  
    res.json({ sicknote })
  })
  
  sicknoteRouter.post('/sicknote', async (req, res) => {
    const sicknote = await prisma.sicknote.create({
      data: {
        period: req.body.period,
        finishAt: new Date(req.body.finishAt),
        startAt: new Date(req.body.startAt),
        belongsToId: req.body.belongsToId,
        year: parseInt(req.body.year),
        month: parseInt(req.body.month)
      }
    })
  })

  export default sicknoteRouter