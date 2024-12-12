import { NextFunction, Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../modules/middleware'
import { deleteVacation } from '../handlers/vacationHadlers'

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const vacationPlanRouter = Router()
export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id: string
    role: string
  } // or any other type
}
vacationPlanRouter.get('/vacations', async (req, res) => {
  const vacation: any = await prisma.vacation.findMany({
    orderBy: {
      month: 'asc'
    }
  })
  res.json({ vacation })
})

vacationPlanRouter.get('/vacation/:id', async (req, res) => {
  const { id } = req.params
  const vacation: any = await prisma.vacation.findMany({
    where: {
      belongsToId: id
    }
  })
  res.json({ vacation })
})
vacationPlanRouter.get('/vacations/month/:month', async (req, res) => {
  const { month } = req.params
  const intMonth = parseInt(month)
  const vacation: any =
    await prisma.$queryRaw`SELECT "Vacation".id, "User"."name", "User".posto, "User".mat, "Vacation"."month","Vacation"."year", "Vacation"."period", "Vacation"."startAt", "Vacation"."finishAt" FROM "User" INNER join "Vacation" ON "User".id = "Vacation"."belongsToId" WHERE "Vacation"."month" = ${intMonth}  ORDER BY "User".posto asc  `
  res.json(vacation)
})

vacationPlanRouter.get('/vacation/quantity', async (req, res) => {
  const vacation: any =
    await prisma.$queryRaw`SELECT  COUNT(*) FROM "Vacation" WHERE "Vacation"."month" =  date_part('month', (SELECT current_timestamp)) aND  "Vacation"."year" =   date_part('year', (SELECT current_timestamp))  GROUP BY "Vacation"."month"`

  res.json({ vacation })
})

vacationPlanRouter.post('/vacationsplan', handleInputErrors, async (req, res) => {
  console.log(req.body)
  const vacation = await prisma.vacationPlan.create({
    data: {
      mat: req.body.mat,
      optionOne: req.body.optionOne,
      optionTwo: req.body.optionTwo,
      phone: req.body.phone
    }
  })
  return res.sendStatus(200)
})
vacationPlanRouter.get('/vacation/users/1', async (req, res, next) => {
  try {
    const vacation =
      await prisma.$queryRaw`SELECT "User".id as value, "User".name ||  ' - ' || "User".posto as label FROM "User" ORDER BY label`

    res.json(vacation)
  } catch (e) {
    next(e)
  }
})

vacationPlanRouter.delete(
  '/vacations/:id',
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    console.log(req.user)
    const axios = require('axios')
    let data = {
      number: '5575992313592',
      text: 'teste de envio'
    }

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://evo-lk008co0wocs40wcgcwcsosc.49.13.196.55.sslip.io/message/sendText/Whast',
      headers: {
        apikey: '273657F3FF14-4D2E-A5A3-0A047A51138E'
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

export default vacationPlanRouter
