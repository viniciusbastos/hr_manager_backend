import { NextFunction, Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../modules/middleware.js'
import { deleteVacation } from '../handlers/vacationHadlers.js'
import { Prisma, PrismaClient } from '@prisma/client'
import { MessageService } from '../services/messageService.js'

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

vacationPlanRouter.put('/vacationplan/:id', async (req, res) => {
  try {
    const vacation: any = await prisma.vacationPlan.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        optionOne: req.body.optionOne,
        optionTwo: req.body.optionTwo
      }
    })
    res.json({ vacation })
  } catch (e) {
    console.log
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        // Handle unique constraint violation
      } else if (e.code === 'P2025') {
        // Handle record not found
      }
    }
    throw e
  }
})
vacationPlanRouter.get('/vacationsplan/:phone', async (req, res) => {
  const { phone } = req.params

  const vacation: any = await prisma.$queryRaw`SELECT 
    "VacationPlan"."id",
    "VacationPlan"."mat",
    "VacationPlan"."phone",
    "User"."posto",
    "User"."name",
    CASE "optionOne"
        WHEN 1 THEN 'Janeiro de 2026'
        WHEN 2 THEN 'Fevereiro'
        WHEN 3 THEN 'Março'
        WHEN 4 THEN 'Abril'
        WHEN 5 THEN 'Maio'
        WHEN 6 THEN 'Junho'
        WHEN 7 THEN 'Julho'
        WHEN 8 THEN 'Agosto'
        WHEN 9 THEN 'Setembro'
        WHEN 10 THEN 'Outubro'
        WHEN 11 THEN 'Novembro'
        WHEN 12 THEN 'Dezembro'
        ELSE 'Mês inválido' -- Caso o número não esteja entre 1 e 12
    END AS opcaoOne,
    CASE "optionTwo"
        WHEN 1 THEN 'Janeiro'
        WHEN 2 THEN 'Fevereiro'
        WHEN 3 THEN 'Março'
        WHEN 4 THEN 'Abril'
        WHEN 5 THEN 'Maio'
        WHEN 6 THEN 'Junho'
        WHEN 7 THEN 'Julho'
        WHEN 8 THEN 'Agosto'
        WHEN 9 THEN 'Setembro'
        WHEN 10 THEN 'Outubro'
        WHEN 11 THEN 'Novembro'
        WHEN 12 THEN 'Dezembro'
        ELSE 'Mês inválido' -- Caso o número não esteja entre 1 e 12
    END AS opcaoTwo
    
FROM 
    "VacationPlan"

INNER JOIN "User"
ON 
"User"."mat" = "VacationPlan"."mat" 
WHERE "VacationPlan"."phone" = ${phone}`
  res.json(vacation)
})

vacationPlanRouter.get('/vacationsplan', async (req, res) => {
  const vacationPlan: any = await prisma.$queryRaw`SELECT 
    "VacationPlan"."id",
    "VacationPlan"."mat",
    "User"."posto",
    "User"."name",
    "VacationPlan"."phone",
    CASE "optionOne"
        WHEN 1 THEN 'Janeiro'
        WHEN 2 THEN 'Fevereiro'
        WHEN 3 THEN 'Março'
        WHEN 4 THEN 'Abril'
        WHEN 5 THEN 'Maio'
        WHEN 6 THEN 'Junho'
        WHEN 7 THEN 'Julho'
        WHEN 8 THEN 'Agosto'
        WHEN 9 THEN 'Setembro'
        WHEN 10 THEN 'Outubro'
        WHEN 11 THEN 'Novembro'
        WHEN 12 THEN 'Dezembro'
        ELSE 'Mês inválido' -- Caso o número não esteja entre 1 e 12
    END AS opcaoOne,
    CASE "optionTwo"
        WHEN 1 THEN 'Janeiro 2026'
        WHEN 2 THEN 'Fevereiro'
        WHEN 3 THEN 'Março'
        WHEN 4 THEN 'Abril'
        WHEN 5 THEN 'Maio'
        WHEN 6 THEN 'Junho'
        WHEN 7 THEN 'Julho'
        WHEN 8 THEN 'Agosto'
        WHEN 9 THEN 'Setembro'
        WHEN 10 THEN 'Outubro'
        WHEN 11 THEN 'Novembro'
        WHEN 12 THEN 'Dezembro'
        ELSE 'Mês inválido' -- Caso o número não esteja entre 1 e 12
    END AS opcaoTwo
    
FROM 
    "VacationPlan"
    
INNER JOIN "User"
ON 
"User"."mat" = "VacationPlan"."mat" 
ORDER BY "VacationPlan"."createdAt" DESC;`

  res.json(vacationPlan)
})

vacationPlanRouter.post('/vacationsplan', handleInputErrors, async (req, res) => {
  console.log(req.body)
  const vacation = await prisma.vacationPlan.create({
    data: {
      mat: req.body.mat,
      optionOne: req.body.optionOne,
      optionTwo: req.body.optionTwo,
      phone: req.body.phone,
      pelotao: req.body.pelotao
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
  '/vacationsplan/:id',
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const messageService = new MessageService()

    try {
      const user = await prisma.vacationPlan.findUnique({
        where: {
          id: parseInt(req.params.id)
        }
      })

      if (!user) {
        return res.status(404).json({ message: 'Vacation plan not found' })
      }

      // Send cancellation message
      await messageService.sendMessage({
        number: user?.phone,
        text: 'Sua solicitação de férias foi cancelada, por favor entre em contato com o RH para mais informações.'
      })

      // Delete vacation plan
      const deleted = await prisma.vacationPlan.delete({
        where: {
          id: parseInt(req.params.id)
        }
      })

      res.status(204).json({ data: deleted })
    } catch (error) {
      console.error('Operation failed:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

export default vacationPlanRouter
