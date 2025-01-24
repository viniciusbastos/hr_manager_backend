import { Weapons } from './../../node_modules/.prisma/client/index.d'
import { Router } from 'express'
import { body } from 'express-validator'
import * as fs from 'fs'
import { handleInputErrors } from '../modules/middleware'
import { deleteVacation } from '../handlers/vacationHadlers'
import { request } from 'http'
import {
  showWeapons,
  updateProfileWeapon,
  updateProfileWeaponAndLocation
} from '../controllers/weapons.controllers'
import { WeaponRequestPDF } from '../modules/pdf'
import path from 'path'
import { json } from 'stream/consumers'

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const weaponsRouter = Router()

weaponsRouter.get('/weapons', showWeapons)
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
    "WeaponType"."type" as "weaponType",
    "WeaponStatus"."Status",
    "WeaponCaliber"."Caliber",
    "WeaponLocation"."location",
    "ProfileWeapons"."InitialDate", 
    "ProfileWeapons"."discharge", 
    "ProfileWeapons"."id",
    "WeaponBrand"."name" as brand
    FROM "ProfileWeapons"  
    INNER JOIN "Weapons" 
    ON 
    "ProfileWeapons"."belongsToWeaponsId" = "Weapons".id 
    INNER JOIN "User" 
    ON "ProfileWeapons"."belongsToId" = "User".id 
    INNER JOIN "WeaponBrand" 
    ON "WeaponBrand".id = "Weapons".brand
    INNER JOIN "WeaponType" ON "WeaponType"."id" = "Weapons"."type" 
INNER JOIN "WeaponStatus" ON "WeaponStatus"."id" = "Weapons"."status" 
INNER JOIN "WeaponCaliber" ON "WeaponCaliber"."id" = "Weapons"."caliber" 
INNER JOIN "WeaponLocation" ON "WeaponLocation"."id" = "Weapons"."location"
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

weaponsRouter.post('/weapons/copy/:id', async (req, res) => {
  try {
    const [newWeapon] = await prisma.$transaction(async prisma => {
      // Get the existing weapon
      const existingWeapon = await prisma.profileWeapons.findUnique({
        where: {
          id: parseInt(req.params.id)
        }
      })

      if (!existingWeapon) {
        throw new Error('Weapon not found')
      }

      // Create new weapon with copied data
      const weaponCopy = await prisma.profileWeapons.create({
        data: {
          // Copy all relevant fields except unique identifiers
          InitialDate: new Date(),
          belongsToId: existingWeapon.belongsToId,
          belongsToWeaponsId: existingWeapon.belongsToWeaponsId
          // Add any other fields you want to copy
        }
      })
      console.log(weaponCopy)
      const updateProfileWeapon = await prisma.profileWeapons.update({
        where: { id: existingWeapon.id },
        data: {
          discharge: true
        }
      })
      return [weaponCopy]
    })

    return res.status(201).json({
      message: 'Carga fixa renovada com sucesso!',
      weapon: newWeapon
    })
  } catch (error) {
    return res.status(400).json({
      error: error.message
    })
  }
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
weaponsRouter.put('/weaponsfixed/:id', updateProfileWeaponAndLocation)

weaponsRouter.post('/generate-pdf/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const fs = require('fs')
  const path = require('path')
  try {
    const weaponData = await prisma.$queryRaw`
      SELECT 
        "User".mat, 
        "User".posto, 
        "User"."name", 
        "Weapons".model, 
        "Weapons"."serialNumber", 
        "WeaponType"."type" as "weaponType",
        "WeaponStatus"."Status",
        "WeaponCaliber"."Caliber",
        "WeaponLocation"."location",
        "ProfileWeapons"."InitialDate", 
        "ProfileWeapons"."discharge", 
        "ProfileWeapons"."id",
        "WeaponBrand"."name" as brand
      FROM "ProfileWeapons"  
      INNER JOIN "Weapons" 
      ON 
      "ProfileWeapons"."belongsToWeaponsId" = "Weapons".id 
      INNER JOIN "User" 
      ON "ProfileWeapons"."belongsToId" = "User".id 
      INNER JOIN "WeaponBrand" 
      ON "WeaponBrand".id = "Weapons".brand
      INNER JOIN "WeaponType" ON "WeaponType"."id" = "Weapons"."type" 
      INNER JOIN "WeaponStatus" ON "WeaponStatus"."id" = "Weapons"."status" 
      INNER JOIN "WeaponCaliber" ON "WeaponCaliber"."id" = "Weapons"."caliber" 
      INNER JOIN "WeaponLocation" ON "WeaponLocation"."id" = "Weapons"."location"
      WHERE "ProfileWeapons"."discharge" IS FALSE AND "ProfileWeapons"."id" = ${id}
      ORDER BY "ProfileWeapons"."InitialDate" DESC
    `

    if (weaponData.length === 0) {
      return res.status(404).json({ error: 'Weapon data not found' })
    }

    const weaponDataJson = JSON.parse(JSON.stringify(weaponData[0])) // Get first result and parse
    console.log(weaponDataJson)

    // Create unique filename using timestamp
    const fileName = await `weapon-request-${weaponDataJson.id}.pdf`
    const outputPath = await path.join(__dirname, '../assets/', fileName)

    // Ensure the directory exists
    const dirPath = path.dirname(outputPath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Generate PDF
    const pdfGenerator = new WeaponRequestPDF(weaponDataJson)
    await pdfGenerator.generatePDF(outputPath)
    const axios = require('axios')
    let data = JSON.stringify({
      number: '557592313592 (Recipient number with Country Code)',
      mediatype: 'document',
      mimetype: 'application/pdf',
      caption: 'Teste de caption',
      media:
        'https://github.com/viniciusbastos/hr_manager_backend/blob/main/src/assets/weapon-request-59.pdf',
      fileName: fileName
    })
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://evolution.bastosdev.info/message/sendMedia/Whast',
      headers: {
        'Content-Type': 'application/json',
        apikey: 'd91f2743-1587-4967-b8f8-04cf1cc1dadd'
      },
      data: data
    }

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data))
      })
      .catch(error => {
        console.log(error)
      })
    res.json({ message: 'PDF generated successfully', fileName })
  } catch (error) {
    console.error('Error generating weapon request PDF:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default weaponsRouter
function jsonparse(weaponData: any) {
  throw new Error('Function not implemented.')
}
