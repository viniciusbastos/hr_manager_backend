import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../modules/middleware'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const sicknoteRouter = Router()


//Atestados Médicos

sicknoteRouter.get('/sicknote', async (req, res) => {
    const sicknotes: any = 
    await prisma.$queryRaw`SELECT * FROM "User" INNER JOIN "Sicknote" ON "Sicknote"."belongsToId" = "User"."id"`
    
    res.json({ sicknotes })
  })
  
  sicknoteRouter.get('/sicknote/:id', async (req, res, next) => {
    try{
        const { id } = req.params
        const sicknote: any = await prisma.sicknote.findMany({
          where: {
            belongsToId: id
          }
        })
        res.json({ sicknote })
    } catch(e){
        next(e)
    }
    
  })
  sicknoteRouter.get('/sicknote/month/:month', async (req, res, next) => {
    try {
    const { month } = req.params
    const intMonth = parseInt(month)
    const sicknote: any =
      await prisma.$queryRaw`SELECT "User".id, "User"."name", "User".posto, "User".mat, "Sicknote"."InitialDate","Sicknote"."FinalDate" FROM "User" INNER join "Sicknote" ON "User".id = "Sicknote"."belongsToId" WHERE "Sicknote"."month" =  ${intMonth}`
    res.json({ sicknote })
    }
    catch (e) {
        next(e)
      }
  })
  
  sicknoteRouter.get('/sicknote/quantity', async (req, res, next) => {
    try{

        const sicknote: any =
          await prisma.$queryRaw`SELECT "Sicknote"."month", COUNT(*) FROM "Sicknote" WHERE "Sicknote"."month" = (SELECT date_part('month', (SELECT current_timestamp))) AND "Sicknote"."year" = (SELECT date_part('year', (SELECT current_timestamp))) GROUP BY "Sicknote"."month"`
        res.json(sicknote)
    }
    catch(e){
        next(e)
    }
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

