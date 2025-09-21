import { Status } from '@prisma/client'
import { comparePasswords, createJWT, hashPassword } from '../modules/auth.js'
import prisma from '../db.js'
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
