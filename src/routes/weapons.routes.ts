import { Weapons } from './../../node_modules/.prisma/client/index.d';
import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../modules/middleware'
import { deleteVacation } from '../handlers/vacationHadlers'
import { request } from 'http';

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const weaponsRouter = Router()

weaponsRouter.get('/weapons', async (req, res) => {
  const weapons: any = await prisma.weapons.findMany({
    orderBy: {
      serialNumber: 'asc'
    }
  })
  res.json({ weapons })
})
weaponsRouter.get('/weapons/label', async (req, res) => {
  
  const weapons: any =  await prisma.$queryRaw`SELECT   "Weapons"."id" as value , "Weapons"."serialNumber" as label FROM "Weapons" `

  res.json( weapons )
})

weaponsRouter.get('/weapons/fixed', async (req, res) => {
  
  const weapons: any =  await prisma.$queryRaw`SELECT "User".mat, "User".posto, "User"."name", "Weapons".model, "Weapons"."serialNumber", "ProfileWeapons"."InitialDate", "ProfileWeapons"."valid", "ProfileWeapons"."id" FROM "ProfileWeapons"  INNER JOIN "Weapons" ON "ProfileWeapons"."belongsToWeaponsId" = "Weapons".id INNER JOIN "User" ON "ProfileWeapons"."belongsToId" = "User".id ORDER BY "ProfileWeapons"."InitialDate" Desc`

  res.json( weapons )
})
weaponsRouter.get('/weapons/info', async (req, res) => {
  
  const weapons: any =  await prisma.$queryRaw`
  SELECT "Weapons".id, "Weapons".model, "Weapons"."serialNumber", "WeaponType"."type", "WeaponStatus"."Status", "WeaponCaliber"."Caliber", "WeaponLocation"."location" FROM "Weapons" 
INNER JOIN "WeaponType" ON "WeaponType"."id" = "Weapons"."type" 
INNER JOIN "WeaponStatus" ON "WeaponStatus"."id" = "Weapons"."status" 
INNER JOIN "WeaponCaliber" ON "WeaponCaliber"."id" = "Weapons"."caliber" 
INNER JOIN "WeaponLocation" ON "WeaponLocation"."id" = "Weapons"."location"`

  res.json( weapons )
})

weaponsRouter.get('/weaponprofile/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const weapons: any =  
  await prisma.$queryRaw`SELECT "User".mat, "User".posto, "User"."name", "Weapons".model, "Weapons"."serialNumber", "ProfileWeapons"."InitialDate", "ProfileWeapons"."valid", "ProfileWeapons"."id" FROM "ProfileWeapons"  INNER JOIN "Weapons" ON "ProfileWeapons"."belongsToWeaponsId" = "Weapons".id INNER JOIN "User" ON "ProfileWeapons"."belongsToId" = "User".id WHERE "ProfileWeapons"."id" = ${id}  ORDER BY "ProfileWeapons"."InitialDate" Desc`

  res.json( {weapons} )
})

weaponsRouter.post('/weapons/fixed', async (req, res) => {
  const weapons = await prisma.profileWeapons.create({
    data: {
      InitialDate: new Date(req.body.InitialDate),
      belongsToId: req.body.belongsToId,
      belongsToWeaponsId: req.body.serialNumber,
    }
  })
  return res.sendStatus(200)
})
weaponsRouter.delete('/weapons/:id', async (req, res) => {
  try{
    const { id } = req.params
    console.log(id)
    const deleted = await prisma.profileWeapons.delete({
      where: {
        id: parseInt(id)
      }
    })
  
    res.json({ data: deleted })
} catch(e){
   
}
})

// vacationRouter.delete('/vacation/:id', deleteVacation)

export default weaponsRouter;