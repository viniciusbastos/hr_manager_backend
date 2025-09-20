import { Weapons } from './../../node_modules/.prisma/client/index.d'
import { Router } from 'express'
import { body } from 'express-validator'
import * as fs from 'fs'
import { handleInputErrors } from '../modules/middleware'
import { deleteVacation } from '../handlers/vacationHadlers'
import { request } from 'http'
import {
  newWeapons,
  showWeapons,
  showWeapon,
  updateProfileWeapon,
  updateProfileWeaponAndLocation,
  weaponEdit
} from '../controllers/weapons.controllers'

import extendedPrisma from '../db'
import prisma from '../db'
import { WeaponRequestPDF } from '../modules/pdf'

const weaponsRouter = Router()

weaponsRouter.get('/weapons', showWeapons)
weaponsRouter.get('/showweaponsbyid/:id', showWeapon)
weaponsRouter.post('/newWeapons', newWeapons)
weaponsRouter.put('/editweapon/:id', weaponEdit)

weaponsRouter.get('/weapons/label', async (req, res) => {
  try {
    const weapons: any = await extendedPrisma.$queryRaw`
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
  } catch (error) {
    console.error('Error fetching weapon labels:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

weaponsRouter.get('/weapons/fixed', async (req, res) => {
  try {
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
    console.log(weapons)
    res.json(
      JSON.parse(
        JSON.stringify(weapons, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      )
    )
  } catch (error) {
    console.error('Error fetching fixed weapons:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

weaponsRouter.get('/weapons/info', async (req, res) => {
  try {
    const weapons: any = await extendedPrisma.$queryRaw`
    SELECT "Weapons".id, "Weapons".model, "Weapons"."serialNumber", "WeaponType"."type", "WeaponStatus"."Status", "WeaponCaliber"."Caliber", "WeaponLocation"."location" FROM "Weapons"
  INNER JOIN "WeaponType" ON "WeaponType"."id" = "Weapons"."type"
  INNER JOIN "WeaponStatus" ON "WeaponStatus"."id" = "Weapons"."status"
  INNER JOIN "WeaponCaliber" ON "WeaponCaliber"."id" = "Weapons"."caliber"
  INNER JOIN "WeaponLocation" ON "WeaponLocation"."id" = "Weapons"."location"
  ORDER BY "Weapons".id ASC`

    res.json(weapons)
  } catch (error) {
    console.error('Error fetching weapon info:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

weaponsRouter.get('/weaponprofile/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const weapons: any =
      await extendedPrisma.$queryRaw`SELECT "User".mat, "User".posto, "User"."name", "Weapons".model, "Weapons"."serialNumber", "ProfileWeapons"."InitialDate", "ProfileWeapons"."discharge", "ProfileWeapons"."id"
    FROM "ProfileWeapons"  INNER JOIN "Weapons" ON "ProfileWeapons"."belongsToWeaponsId" = "Weapons".id INNER JOIN "User" ON "ProfileWeapons"."belongsToId" = "User".id WHERE "ProfileWeapons"."id" = ${id}  ORDER BY "ProfileWeapons"."InitialDate" Desc`

    res.status(200).json({ weapons })
  } catch (error) {
    console.error('Error fetching weapon profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
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

    console.log(updateWeapon)
    return [user, updateWeapon]
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
    const weaponData: any[] = await prisma.$queryRaw`
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

    const weaponDataJson = weaponData[0] as any // Get first result
    console.log(weaponDataJson)

    // Create unique filename using timestamp
    const fileName = `weapon-request-${weaponDataJson.id}.pdf`
    const outputPath = path.join(__dirname, '../assets/', fileName)

    // Generate PDF

    await new Promise<void>((resolve, reject) => {
      try {
        const pdfGenerator = new WeaponRequestPDF(weaponDataJson)
        pdfGenerator.generatePDF(outputPath)

        // Wait for file to exist before proceeding
        const checkFileExists = setInterval(() => {
          if (fs.existsSync(outputPath)) {
            clearInterval(checkFileExists)
            resolve()
          }
        }, 100)

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkFileExists)
          reject(new Error('PDF generation timeout'))
        }, 5000)
      } catch (error) {
        reject(error)
      }
    })

    // Verify file exists
    if (!fs.existsSync(outputPath)) {
      throw new Error('PDF file not generated')
    }

    const pdfBuffer = fs.readFileSync(outputPath)
    const base64PDF = pdfBuffer.toString('base64')

    // try {
    //   await sendDocumentToNumber('+557592313592', fileName, base64PDF)
    // } catch (error) {
    //   console.error('Failed to send document:', error)
    // }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`
    })
    res.download(outputPath, fileName)
  } catch (error) {
    console.error('Error generating weapon request PDF:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default weaponsRouter
