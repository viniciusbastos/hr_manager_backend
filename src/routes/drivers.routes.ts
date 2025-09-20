import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../modules/middleware'
import { url } from 'inspector'
import prisma from '../db'
const driversRouter = Router()

//Atestados Médicos

driversRouter.get('/drivers', async (req, res) => {
  const drivers: any =
    await prisma.$queryRaw`SELECT matricula,posto, name FROM public."Drivers" INNER JOIN public."User" ON "User".mat = "Drivers".matricula
`

  res.json({ drivers })
})

driversRouter.get('/drivers/:mat', async (req, res, next) => {
  try {
    const { mat } = req.params
    const drivers: any = await prisma.drivers.findMany({
      where: {
        matricula: mat
      }
    })
    res.json({ drivers })
  } catch (e) {
    next(e)
  }
})

driversRouter.get('/drivers/quantity', async (req, res, next) => {
  try {
    const drivers: any =
      await prisma.$queryRaw`SELECT "drivers"."month", COUNT(*) FROM "drivers" WHERE "drivers"."month" = (SELECT date_part('month', (SELECT current_timestamp))) AND "drivers"."year" = (SELECT date_part('year', (SELECT current_timestamp))) GROUP BY "drivers"."month"`
    res.json(drivers)
  } catch (e) {
    next(e)
  }
})

driversRouter.post('/drivers', async (req, res) => {
  const sicknote = await prisma.sicknote.create({
    data: {
      Days: parseInt(req.body.Days),
      InitialDate: new Date(req.body.InitialDate),
      belongsToId: req.body.belongsToId,
      Cid: req.body.Cid,
      crm: req.body.crm,
      DoctorName: req.body.DoctorName,
      url: req.body.url
    }
  })
  return res.sendStatus(200)
})

export default driversRouter
