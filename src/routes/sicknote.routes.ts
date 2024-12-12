import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../modules/middleware'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const sicknoteRouter = Router()

//Atestados Médicos

sicknoteRouter.get('/sicknote', async (req, res) => {
  const sicknotes: any = await prisma.$queryRaw`
    SELECT 
    "User"."mat", 
    "User"."name", 
    "User"."posto", 
    "Sicknote"."InitialDate", 
    "Sicknote"."InitialDate" + ("Sicknote"."Days" - 1) * INTERVAL '1 day' AS FinalDate, 
    "Sicknote"."Days",
    "Sicknote"."Cid", 
    "Sicknote"."id",
    "Sicknote"."createdAt"
    FROM "User" 
    INNER JOIN "Sicknote" ON "Sicknote"."belongsToId" = "User"."id" 
    ORDER BY FinalDate DESC`

  res.json({ sicknotes })
})

sicknoteRouter.get('/sicknote/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const sicknote: any = await prisma.sicknote.findMany({
      where: {
        belongsToId: id
      }
    })
    res.json({ sicknote })
  } catch (e) {
    next(e)
  }
})
sicknoteRouter.get('/sicknote/month/:month', async (req, res, next) => {
  try {
    const { month } = req.params
    const intMonth = parseInt(month)
    const sicknote: any =
      await prisma.$queryRaw`SELECT "User".id, "User"."name", "User".posto, "User".mat, "Sicknote"."InitialDate",("Sicknote"."InitialDate" + ("Sicknote"."Days" || ' days')::interval) as FinalDate, "Sicknote". FROM "User" INNER join "Sicknote" ON "User".id = "Sicknote"."belongsToId" WHERE "Sicknote"."month" =  ${intMonth}`
    res.json({ sicknote })
  } catch (e) {
    next(e)
  }
})

sicknoteRouter.get('/sicknote/quantity', async (req, res, next) => {
  try {
    const sicknote: any =
      await prisma.$queryRaw`SELECT "Sicknote"."month", COUNT(*) FROM "Sicknote" WHERE "Sicknote"."month" = (SELECT date_part('month', (SELECT current_timestamp))) AND "Sicknote"."year" = (SELECT date_part('year', (SELECT current_timestamp))) GROUP BY "Sicknote"."month"`
    res.json(sicknote)
  } catch (e) {
    next(e)
  }
})

sicknoteRouter.post('/sicknote', async (req, res) => {
  const sicknote = await prisma.sicknote.create({
    data: {
      Days: parseInt(req.body.Days),
      InitialDate: new Date(req.body.InitialDate),
      belongsToId: req.body.belongsToId,
      Cid: req.body.Cid,
      crm: req.body.crm,
      DoctorName: req.body.DoctorName
    }
  })
  return res.sendStatus(200)
})
sicknoteRouter.delete('/sicknote/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await prisma.sicknote.delete({
      where: {
        id: parseInt(id)
      }
    })

    res.json({ data: deleted })
  } catch (e) {}
})

export default sicknoteRouter
