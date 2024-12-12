import { Status } from './../../node_modules/.prisma/client/index.d'
import { comparePasswords, createJWT, hashPassword } from './../modules/auth'
import prisma from '../db'
import { Request, Response } from 'express'

export const deleteVacation = async (req: any, res: any) => {
  console.log(req.params.id)
  try {
    const deleted = await prisma.vacation.delete({
      where: {
        id: req.params.id
      }
    })
    res.status(204).json({ data: deleted })
  } catch (e) {
    res.status(400)
    res.json({ message: 'error' })
  }
}
