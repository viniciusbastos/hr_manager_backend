import { Response, Request, RequestHandler } from 'express'
import { body } from 'express-validator'
import { createUser, deleteUser } from '../handlers/userHandlers'
import { handleInputErrors } from '../modules/middleware'
import { add } from 'lodash'
import prisma from '../db'
import extendedPrisma from '../db'

export const showUsers: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    const idUnidade = 1
    const user =
      await extendedPrisma.$queryRaw`SELECT "User".id, "User".mat, "User"."name", "User".posto, "Unidades"."name" as unidade, "User".role as role, "Unidades".id as idUnidade FROM "User" INNER JOIN "Profileunidade" ON "Profileunidade"."belongsToId" = "User".id  INNER JOIN "Unidades" ON "Unidades".id = "Profileunidade"."belongsToUnidadeId"  WHERE "Unidades".id = ${idUnidade} ORDER BY "User"."createdAt"`

    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
}

export const showUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const user: any = await extendedPrisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        profile: {
          select: {
            phone: true,
            address: true
          }
        }
      }
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    console.log(user)
    res.status(200)
    res.json({ user: user })
  } catch (e) {
    console.log(e, 'erro aqui')
    next(e)
  }
}

export const editUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const { phone, address, ...userData } = req.body

    // Update user data
    const user: any = await extendedPrisma.user.update({
      where: {
        id: id
      },
      data: userData,
      include: {
        profile: true
      }
    })

    // Update or create profile with phone and address
    if (phone !== undefined || address !== undefined) {
      const profileData: any = {}
      if (phone !== undefined) profileData.phone = phone
      if (address !== undefined) profileData.address = address

      if (user.profile && user.profile.length > 0) {
        // Update existing profile
        await extendedPrisma.profile.update({
          where: {
            id: user.profile[0].id
          },
          data: profileData
        })
      } else {
        // Create new profile if it doesn't exist
        await extendedPrisma.profile.create({
          data: {
            ...profileData,
            belongsToId: id
          }
        })
      }
    }

    // Fetch updated user with profile data
    const updatedUser = await extendedPrisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        profile: {
          select: {
            phone: true,
            address: true
          }
        }
      }
    })

    console.log('user edit', updatedUser)
    res.status(200)
    res.json({ user: updatedUser })
  } catch (e) {
    next(e)
  }
}
