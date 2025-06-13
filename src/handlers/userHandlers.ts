import { comparePasswords, createJWT, hashPassword } from './../modules/auth'
import prisma from '../db'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

export const createUser = async (req: any, res: any, next: any) => {
  try {
    // const hash = await hashPassword(req.body.password)

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        posto: req.body.posto,
        mat: req.body.mat,
        useremail: req.body.email
      }
    })
    const token = createJWT(user)
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
  const id = req.body.id
  const useremail = req.body.email
  const role = req.body.role
  const name = req.body.name
  const posto = req.body.role
  const isValid = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
  if (!isValid) {
    res.status(401)
    res.send('Invalid username or password')
    return
  }

  const token = createJWT(user)
  console.log(user)
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
