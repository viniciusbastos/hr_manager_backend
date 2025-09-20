import { Response, Request, RequestHandler } from 'express'
import { body } from 'express-validator'
import { createUser, deleteUser } from '../handlers/userHandlers'
import { handleInputErrors } from '../modules/middleware'
import prisma from '../db'
import extendedPrisma from '../db'

export const showWeapons: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    const weapons: any = await extendedPrisma.weapons.findMany({
      orderBy: {
        serialNumber: 'asc'
      }
    })
    res.json({ weapons })
  } catch (e) {
    next(e)
  }
}

export const showWeapon: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const weaponId = parseInt(id, 10)

    if (isNaN(weaponId)) {
      return res.status(400).json({ error: 'Invalid weapon ID format' })
    }

    console.log('Fetching weapon with ID:', weaponId)

    const weapon: any = await prisma.weapons.findFirst({
      where: { id: weaponId }
    })

    if (!weapon || weapon.length === 0) {
      return res.status(404).json({ message: 'Weapon not found' })
    }

    console.log('Weapon found:', weapon)
    res.status(200).json({ weapon: weapon })
  } catch (e) {
    console.log(e, 'Error fetching weapon')
    next(e)
  }
}
export const newWeapons: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    console.log(req.body)
    const weapons: any = await prisma.weapons.create({
      data: {
        model: req.body.model,
        type: req.body.type ? parseInt(req.body.type, 10) : undefined,
        serialNumber: req.body.serialNumber,
        location: req.body.location ? parseInt(req.body.location, 10) : undefined,
        status: req.body.status ? parseInt(req.body.status, 10) : undefined,
        caliber: req.body.caliber ? parseInt(req.body.caliber, 10) : undefined,
        brand: req.body.brand ? parseInt(req.body.brand, 10) : undefined
      }
    })
    res.status(201).json({ weapons })
  } catch (e) {
    next(e)
  }
}

export const updateProfileWeapon: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params
    const weaponChargeId = parseInt(req.params.id, 10)

    if (isNaN(weaponChargeId)) {
      console.error('Invalid ID format:', id)
      return res.status(400).json({ error: 'Invalid ID format' })
    }

    // Find the weapon to be deleted
    console.log(`Searching for profileWeapons with ID: ${weaponChargeId}`)
    const weapon = await prisma.profileWeapons.findUnique({
      where: { id: weaponChargeId }
    })
    if (!weapon) {
      console.error('Weapon not found:', id)
      return res.status(404).json({ error: 'Weapon not found' })
    }

    // Delete the weapon from profileWeapons
    console.log(`Updating profileWeapons with ID: ${id}`)
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
    console.log(`Updating profileWeapons with ID: ${id}`)
    const updateProfileWeapon = await prisma.profileWeapons.update({
      where: { id: weaponChargeId },
      data: {
        discharge: true
      }
    })
    let updatedWeapon: any
    try {
      // Update the corresponding weapon in weapons table
      if (!weapon.belongsToWeaponsId) {
        return res.status(400).json({ error: 'No weapon ID associated with this profile' })
      }
      console.log(`Updating weapons with ID: ${weapon.belongsToWeaponsId} to location 2`)
      const updatedWeapon = await prisma.weapons.update({
        where: { id: weapon.belongsToWeaponsId },
        data: { location: 2 }
      })
    } catch (e) {
      console.error('Error updating weapon:', e)
    }

    console.log('Successfully deleted profileWeapon and updated weapon')
    res.json({ updateProfileWeapon, updatedWeapon }).status(200)
  } catch (e) {
    next(e)
  }
}

export const weaponEdit: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const weaponId = parseInt(id, 10)

    if (isNaN(weaponId)) {
      return res.status(400).json({ error: 'Invalid weapon ID format' })
    }

    // Prepare update data with proper type conversion
    const updateData: any = {}
    console.log('Request body:', req.body)
    if (req.body.model !== undefined) updateData.model = req.body.model
    if (req.body.serialNumber !== undefined) updateData.serialNumber = req.body.serialNumber
    if (req.body.type !== undefined)
      updateData.type = req.body.type ? parseInt(req.body.type, 10) : undefined
    if (req.body.location !== undefined)
      updateData.location = req.body.location ? parseInt(req.body.location, 10) : undefined
    if (req.body.Status !== undefined)
      updateData.status = req.body.Status ? parseInt(req.body.Status, 10) : undefined
    if (req.body.Caliber !== undefined)
      updateData.caliber = req.body.Caliber ? parseInt(req.body.Caliber, 10) : undefined
    if (req.body.brand !== undefined)
      updateData.brand = req.body.brand ? parseInt(req.body.brand, 10) : undefined

    // Update the weapon
    console.log('Updating weapon with ID:', weaponId, 'with data:', updateData)
    const updatedWeapon = await prisma.weapons.update({
      where: {
        id: weaponId
      },
      data: updateData
    })

    console.log('weapon edit', updatedWeapon)
    res.status(200).json({ weapon: updatedWeapon })
  } catch (e) {
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Weapon not found' })
    }
    next(e)
  }
}
