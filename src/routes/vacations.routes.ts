import { NextFunction, Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../modules/middleware.js'
import { deleteVacation } from '../handlers/vacationHadlers.js'

import prisma from '../db.js'
import axios from 'axios'

const vacationRouter = Router()
export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id: string
    role: string
  } // or any other type
}
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
vacationRouter.get('/vacations/month/:month/:year', async (req, res) => {
  const { month } = req.params
  const { year } = req.params
  const intMonth = parseInt(month)
  const intYear = parseInt(year)
  const vacation: any =
    await prisma.$queryRaw`SELECT "Vacation".id, "User"."name", "User".posto, "User".mat, "Vacation"."month","Vacation"."year", "Vacation"."period", "Vacation"."startAt", "Vacation"."finishAt" FROM "User" INNER join "Vacation" ON "User".id = "Vacation"."belongsToId" WHERE "Vacation"."month" = ${intMonth} and "Vacation"."year" = ${intYear}   ORDER BY "User".posto asc  `
  res.json(vacation)
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

vacationRouter.delete(
  '/vacations/:id',
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    console.log(req.user)
    let data = {
      number: '5575992313592',
      text: 'teste de envio'
    }

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://evolution.bastosdev.info/message/sendText/Whast',
      headers: {
        apikey: process.env.EVOLUTION_API_KEY
      },
      data: data
    }

    // axios
    //   .request(config)
    //   .then(response => {
    //     console.log(JSON.stringify(response.data))
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })

    // try {
    //   const deleted = await prisma.vacation.delete({
    //     where: {
    //       id: req.params.id
    //     }
    //   })
    //   res.status(204).json({ data: deleted })
    // } catch (e) {
    //   res.status(400)
    //   res.json({ message: 'error' })
    // }
  }
)

export default vacationRouter
