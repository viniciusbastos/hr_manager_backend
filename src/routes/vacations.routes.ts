import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../modules/middleware'
import { deleteVacation } from '../handlers/vacationHadlers'

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const vacationRouter = Router()

vacationRouter.get('/vacations', async (req, res) => {
  const vacation: any = await prisma.vacation.findMany({
    orderBy: {
      month: 'asc'
    }
  })
  res.json({ vacation })
})

vacationRouter.get('/vacation/:id', async (req, res) => {
  const { id } = req.params
  const vacation: any = await prisma.vacation.findMany({
    where: {
      belongsToId: id
    }
  })
  res.json({ vacation })
})
vacationRouter.get('/vacations/month/:month', async (req, res) => {
  const { month } = req.params
  const intMonth = parseInt(month)
  const vacation: any =
    await prisma.$queryRaw`SELECT "User".id, "User"."name", "User".posto, "User".mat, "Vacation"."month","Vacation"."year", "Vacation"."period", "Vacation"."startAt", "Vacation"."finishAt" FROM "User" INNER join "Vacation" ON "User".id = "Vacation"."belongsToId" WHERE "Vacation"."month" = ${intMonth}  ORDER BY "User".posto asc  `
  res.json( vacation )
})

vacationRouter.get('/vacation/quantity', async (req, res) => {
  const vacation: any =
    await prisma.$queryRaw`SELECT  COUNT(*) FROM "Vacation" WHERE "Vacation"."month" =  date_part('month', (SELECT current_timestamp)) aND  "Vacation"."year" =   date_part('year', (SELECT current_timestamp))  GROUP BY "Vacation"."month"`

  res.json({ vacation })
})

vacationRouter.post('/vacation', handleInputErrors, async (req, res) => {
  const vacation = await prisma.vacation.create({
    data: {
      period: req.body.period,
      finishAt: new Date(req.body.finishAt),
      startAt: new Date(req.body.startAt),
      belongsToId: req.body.belongsToId,
      year: parseInt(req.body.year),
      month: parseInt(req.body.month)
    }
  })
  return res.sendStatus(200)
  
})
vacationRouter.get('/vacation/users/1', async (req, res, next) => {
    try {
      const vacation =     
      await prisma.$queryRaw`SELECT "User".id as value, "User".name ||  ' - ' || "User".posto as label FROM "User" ORDER BY label`
  
      res.json(vacation)
    } catch (e) {
      next(e)
    }
  
  })

vacationRouter.delete('/vacation/:id', deleteVacation)

export default vacationRouter;