import { Weapons } from './../../node_modules/.prisma/client/index.d'
import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../modules/middleware'
import { deleteVacation } from '../handlers/vacationHadlers'
import { request } from 'http'

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
  const weapons: any = await prisma.$queryRaw`
    SELECT 
    "Weapons"."id" as value, 
    "Weapons"."id"||' - ' ||"WeaponType"."type" || ' - ' || "Weapons"."model" ||' - '|| "Weapons"."serialNumber" as label 
      FROM 
          "Weapons"  
      INNER JOIN
          "WeaponType"
      ON
          "Weapons"."type" = "WeaponType"."id"

      WHERE 
    "Weapons"."location" = 2 
    AND "Weapons"."type" IN ('2', '5')
    ORDER BY "Weapons"."id" ASC
    `

  res.json(weapons)
})

weaponsRouter.get('/weapons/fixed', async (req, res) => {
  const weapons: any = await prisma.$queryRaw`
    SELECT 
		"User".mat, 
    "User".posto, 
    "User"."name", 
    "Weapons".model, 
    "Weapons"."serialNumber", 
    "ProfileWeapons"."InitialDate", 
    "ProfileWeapons"."discharge", 
    "ProfileWeapons"."id" 
    FROM "ProfileWeapons"  
    INNER JOIN "Weapons" 
    ON 
    "ProfileWeapons"."belongsToWeaponsId" = "Weapons".id 
    INNER JOIN "User" 
    ON "ProfileWeapons"."belongsToId" = "User".id 
    WHERE "ProfileWeapons"."discharge" IS FALSE
    ORDER BY "ProfileWeapons"."InitialDate" Desc
`
  res.json(weapons)
})
weaponsRouter.get('/weapons/info', async (req, res) => {
  const weapons: any = await prisma.$queryRaw`
  SELECT "Weapons".id, "Weapons".model, "Weapons"."serialNumber", "WeaponType"."type", "WeaponStatus"."Status", "WeaponCaliber"."Caliber", "WeaponLocation"."location" FROM "Weapons" 
INNER JOIN "WeaponType" ON "WeaponType"."id" = "Weapons"."type" 
INNER JOIN "WeaponStatus" ON "WeaponStatus"."id" = "Weapons"."status" 
INNER JOIN "WeaponCaliber" ON "WeaponCaliber"."id" = "Weapons"."caliber" 
INNER JOIN "WeaponLocation" ON "WeaponLocation"."id" = "Weapons"."location"
ORDER BY "Weapons".id ASC`

  res.json(weapons)
})

weaponsRouter.get('/weaponprofile/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const weapons: any =
    await prisma.$queryRaw`SELECT "User".mat, "User".posto, "User"."name", "Weapons".model, "Weapons"."serialNumber", "ProfileWeapons"."InitialDate", "ProfileWeapons"."discharge", "ProfileWeapons"."id" 
  FROM "ProfileWeapons"  INNER JOIN "Weapons" ON "ProfileWeapons"."belongsToWeaponsId" = "Weapons".id INNER JOIN "User" ON "ProfileWeapons"."belongsToId" = "User".id WHERE "ProfileWeapons"."id" = ${id}  ORDER BY "ProfileWeapons"."InitialDate" Desc`

  res.sendStatus(200).json({ weapons })
})

weaponsRouter.post('/weapons/fixed', async (req, res) => {
  const [weapons, updatedPost] = await prisma.$transaction(async prisma => {
    const user = await prisma.profileWeapons.create({
      data: {
        InitialDate: new Date(req.body.InitialDate),
        belongsToId: req.body.belongsToId,
        belongsToWeaponsId: req.body.serialNumber
      }
    })

    const updateWeapon = await prisma.weapons.update({
      where: {
        id: parseInt(req.body.serialNumber)
      },
      data: {
        location: 1
      }
    })

    return [user, updateWeapon]
    console.log(updateWeapon)
  })

  return res.sendStatus(200)
})
//Delete weapon and update weapon status
weaponsRouter.delete('/weapons/:id', async (req, res) => {
  try {
    const { id } = req.params
    console.log(`Received DELETE request for weapon with ID: ${id}`)

    const weaponId = parseInt(id, 10)

    if (isNaN(weaponId)) {
      console.error('Invalid ID format:', id)
      return res.status(400).json({ error: 'Invalid ID format' })
    }

    // Find the weapon to be deleted
    console.log(`Searching for profileWeapons with ID: ${weaponId}`)
    const weapon = await prisma.profileWeapons.findUnique({
      where: { id: weaponId }
    })

    if (!weapon) {
      console.error('Weapon not found:', weaponId)
      return res.status(404).json({ error: 'Weapon not found' })
    }

    // Delete the weapon from profileWeapons
    console.log(`Deleting profileWeapons with ID: ${weaponId}`)
    const deletedProfileWeapon = await prisma.profileWeapons.delete({
      where: { id: weaponId }
    })

    // Update the corresponding weapon in weapons table
    console.log(`Updating weapons with ID: ${weapon.belongsToWeaponsId} to location 2`)
    const updatedWeapon = await prisma.weapons.update({
      where: { id: weapon.belongsToWeaponsId },
      data: { location: 2 }
    })

    console.log('Successfully deleted profileWeapon and updated weapon')
    res.json({ deletedProfileWeapon, updatedWeapon })
  } catch (error) {
    console.error('Error deleting and updating weapon:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

//Update weapon discharge and update weapon status
weaponsRouter.put('/weaponsfixed/:id', async (req, res) => {
  try {
    const id = req.params
    const weaponChargeId = parseInt(req.params.id, 10)
    console.log(`Searching for profileWeapons with ID: ${weaponChargeId}`)

    if (isNaN(weaponChargeId)) {
      console.error('Invalid ID format:', id)
      return res.status(400).json({ error: 'Invalid ID format' })
    }

    // Find the weapon to be deleted
    console.log(`Searching for profileWeapons with ID: ${id}`)
    const weapon = await prisma.profileWeapons.findUnique({
      where: { id: weaponChargeId }
    })
    console.log(weapon)
    if (!weapon) {
      console.error('Weapon not found:', id)
      return res.status(404).json({ error: 'Weapon not found' })
    }

    // Delete the weapon from profileWeapons
    console.log(`Deleting profileWeapons with ID: ${id}`)
    const updateProfileWeapon = await prisma.profileWeapons.update({
      where: { id: weaponChargeId },
      data: {
        discharge: true
      }
    })

    // Update the corresponding weapon in weapons table
    console.log(`Updating weapons with ID: ${weapon.belongsToWeaponsId} to location 2`)
    const updatedWeapon = await prisma.weapons.update({
      where: { id: weapon.belongsToWeaponsId },
      data: { location: 2 }
    })

    console.log('Successfully deleted profileWeapon and updated weapon')
    res.json({ updateProfileWeapon, updatedWeapon })
  } catch (error) {
    console.error('Error deleting and updating weapon:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
export default weaponsRouter
