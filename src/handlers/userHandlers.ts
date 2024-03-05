import { comparePasswords, createJWT, hashPassword } from './../modules/auth'
import prisma from '../db'
import { Request, Response } from 'express'

export const createUser = async (req: any, res: any, next: any) => {
  try {
    const hash = await hashPassword(req.body.password)

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        password: hash,
        posto: req.body.posto,
        mat: req.body.mat,
        username: req.body.username,
        email: req.body.email
      }
    })
    const token = createJWT(user)
    res.json({ token: token })
  } catch (e: any) {
    e.type = 'input'
    next(e)
  }
}

export const signin = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email }
  })
  const useremail = req.body.email
  const isValid = await comparePasswords(req.body.password, user.password)
  if (!isValid) {
    res.status(401)
    res.send('Invalid username or password')
    return
  }

  const token = createJWT(user)

  res.json({ token, useremail })
}

export const deleteUser = async (req: any, res: any) => {
  const deleted = await prisma.user.delete({
    where: {
      id: req.params.id
    }
  })

  res.json({ data: deleted })
}
