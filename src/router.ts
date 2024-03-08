import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { createUser, deleteUser } from './handlers/userHandlers'
import { handleInputErrors } from './modules/middleware'
import { deleteVacation } from './handlers/vacationHadlers'

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = Router()
/**
 * Product
 */
router.get('/user', async (req, res, next) => {
  try {
    const user = await prisma.user.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
    res.json(user)
  } catch (e) {
    next(e)
  }
})

router.get('/user/:id', async (req, res, next) => {
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

router.get('/user/search/:mat', async (req, res, next) => {
  try {
    const { mat } = req.params
    const user: any =
      await prisma.$queryRaw`SELECT "User".id, "User"."name", "User".posto, "User".mat FROM "User" WHERE "User"."mat" LIKE ${mat} `

    res.json({ user: user })
  } catch (e) {
    next(e)
  }
})
router.post('/user', body('name').isString(), handleInputErrors, createUser)

router.put('/user/:id', (req, res) => {})

router.delete('/user/:id', deleteUser)

/**
 * Update
 */

router.get('/vacation', async (req, res) => {
  const vacation: any = await prisma.vacation.findMany({
    orderBy: {
      month: 'asc'
    }
  })
  res.json({ vacation })
})

router.get('/vacation/:id', async (req, res) => {
  const { id } = req.params
  const vacation: any = await prisma.vacation.findMany({
    where: {
      belongsToId: id
    }
  })
  res.json({ vacation })
})
router.get('/vacation/month/:month', async (req, res) => {
  const { month } = req.params
  const intMonth = parseInt(month)
  const vacation: any =
    await prisma.$queryRaw`SELECT "User".id, "User"."name", "User".posto, "User".mat, "Vacation"."month","Vacation"."year", "Vacation"."period", "Vacation"."startAt", "Vacation"."finishAt" FROM "User" INNER join "Vacation" ON "User".id = "Vacation"."belongsToId" WHERE "Vacation"."month" = ${intMonth} ORDER BY "User".posto asc  `
  res.json({ vacation })
})

router.get('/vacation/quantity', async (req, res) => {
  const vacation: any =
    await prisma.$queryRaw`SELECT  COUNT(*) FROM "Vacation" WHERE "Vacation"."month" =  date_part('month', (SELECT current_timestamp)) aND  "Vacation"."year" =   date_part('year', (SELECT current_timestamp))  GROUP BY "Vacation"."month"`

  res.json({ vacation })
})

router.post('/vacation', handleInputErrors, async (req, res) => {
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
})

router.delete('/vacation/:id', deleteVacation)

/**
 * UpdatePoint
 */

router.get('/efetivo', async (req, res) => {
  const user =
    await prisma.$queryRaw`SELECT "User".posto, COUNT(*)::int as qtd FROM "User" GROUP BY "User".posto`

  res.json(user)
})

router.get('/efetivo/:id', (req, res) => {})

router.post('/efetivo', (req, res) => {})

router.put('/efetivo/:id', (req, res) => {})

router.delete('/efetivo/:id', (req, res) => {})

/**
 * Update
 */

router.get('/courses', async (req, res) => {
  const courses: any = await prisma.course.findMany({})
  res.json({ courses })
})

router.get('/courses/:id', async (req, res) => {
  const { id } = req.params
  const courses: any = await prisma.course.findMany({
    where: {
      belongsToId: id
    }
  })
  res.json({ courses })
})
router.get('/courses/tipo/:name', async (req, res) => {
  const { name } = req.params
  console.log(name)
  const courses: any =
    await prisma.$queryRaw`SELECT "User".id, "User"."name" as nome, "User".posto, "User".mat, "Course"."name","Course"."InitialDate", "Course"."InitialDate", "Course"."FinalDate", "Course".progress FROM "User" INNER join "Course" ON "User".id = "Course"."belongsToId" WHERE "Course"."name" = ${name}`
  res.json({ courses })
})

router.get('/vacation/quantity', async (req, res) => {
  const vacation: any =
    await prisma.$queryRaw`SELECT  COUNT(*) FROM "Vacation" WHERE "Vacation"."month" =  date_part('month', (SELECT current_timestamp)) aND  "Vacation"."year" =   date_part('year', (SELECT current_timestamp))  GROUP BY "Vacation"."month"`

  res.json({ vacation })
})

router.put('/vacation/:id', (req, res) => {})

router.delete('/vacation/:id', (req, res) => {})

//Atestados Médicos

router.get('/sicknote', async (req, res) => {
  const courses: any = await prisma.sicknote.findMany({})
  res.json({ courses })
})

router.get('/sicknote/:id', async (req, res) => {
  const { id } = req.params
  const sicknote: any = await prisma.sicknote.findMany({
    where: {
      belongsToId: id
    }
  })
  res.json({ sicknote })
})
// router.get('/sicknote/month/:month', async (req, res) => {
//   const { month } = req.params
//   const intMonth = parseInt(month)
//   const sicknote: any =
//     await prisma.$queryRaw`SELECT "User".id, "User"."name", "User".posto, "User".mat, "sicknote"."month","sicknote"."year", "sicknote"."period", "sicknote"."startAt", "sicknote"."finishAt" FROM "User" INNER join "sicknote" ON "User".id = "sicknote"."belongsToId" WHERE "sicknote"."month" = ${intMonth}`
//   res.json({ sicknote })
// })

// router.get('/sicknote/quantity', async (req, res) => {
//   const sicknote: any =
//     await prisma.$queryRaw`SELECT  COUNT(*) FROM "sicknote" WHERE "sicknote"."month" =  date_part('month', (SELECT current_timestamp)) aND  "sicknote"."year" =   date_part('year', (SELECT current_timestamp))  GROUP BY "sicknote"."month"`

//   res.json({ sicknote })
// })

// router.post('/sicknote', async (req, res) => {
//   const sicknote = await prisma.sicknote.create({
//     data: {
//       period: req.body.period,
//       finishAt: new Date(req.body.finishAt),
//       startAt: new Date(req.body.startAt),
//       belongsToId: req.body.belongsToId,
//       year: parseInt(req.body.year),
//       month: parseInt(req.body.month)
//     }
//   })
// })

export default router
function next(e: unknown) {
  throw new Error('Function not implemented.')
}
