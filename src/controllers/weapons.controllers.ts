import { Response, Request, RequestHandler } from 'express'
import { body } from 'express-validator'
import { createUser, deleteUser } from '../handlers/userHandlers'
import { handleInputErrors } from '../modules/middleware'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const showWeapons: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    const weapons: any = await prisma.weapons.findMany({
      orderBy: {
        serialNumber: 'asc'
      }
    })
    res.json({ weapons })
  } catch (e) {
    next(e)
  }
}

export const updateProfileWeapon: RequestHandler = async (req, res, next) => {
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
    res.status(200)
  } catch (e) {
    next(e)
  }
}

export const updateProfileWeaponAndLocation: RequestHandler = async (req, res, next) => {
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
    res.json({ updateProfileWeapon, updatedWeapon }).status(200)
  } catch (e) {
    next(e)
  }
}
