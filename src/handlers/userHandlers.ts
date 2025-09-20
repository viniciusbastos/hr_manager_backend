import { Profile } from './../../node_modules/.prisma/client/index.d'
import { comparePasswords, createJWT, hashPassword } from './../modules/auth'
import prisma from '../db'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

interface User {
  id: string
  email: string
  role: string
  name: string
  posto: string
  phone: string
  permissions: string
}

export const createUser = async (req: any, res: any, next: any) => {
  try {
    // const hash = await hashPassword(req.body.password)

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        posto: req.body.posto,
        mat: req.body.mat,
        email: req.body.email,

        Profileunidade: {
          create: {
            belongsToUnidadeId: 1
          }
        }
      }
    })
    const token = createJWT({ ...user, phone: '', permissions: 'USER' })
    res.json({ token: token })
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('No Response Error:', error.request)
    } else {
      console.error('Request Setup Error:', error.message)
    }
    next(error)
  }
}

export const signin = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    select: {
      id: true,
      email: true,
      name: true,
      posto: true,
      role: true,
      password: true,
      profile: {
        select: {
          phone: true
        }
      }
    }
  })
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  const phone = user.profile?.[0]?.phone || ''
  const permissions = 'ADMIN'
  const userPermissions = { ...user, phone, permissions }
  const isValid = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
  if (!isValid) {
    res.status(401)
    res.send('Invalid username or password')
    return
  }

  const token = createJWT(userPermissions)
  console.log(userPermissions)
  res.json({ token })
}

export const deleteUser = async (req: any, res: any) => {
  const deleted = await prisma.user.delete({
    where: {
      id: req.params.id
    }
  })

  res.json({ data: deleted })
}
