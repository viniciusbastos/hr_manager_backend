import { comparePasswords, createJWT, hashPassword } from './../modules/auth'
import prisma from '../db'
import { Request, Response } from 'express'





export const deleteVacation = async (req: any, res: any) => {
  const deleted = await prisma.vacation.delete({
    where: {
      id: req.params.id
    }
  })

  res.json({ data: deleted })
}
