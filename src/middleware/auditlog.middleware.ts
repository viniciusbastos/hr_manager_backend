import prisma from '../db'
import { NextFunction, Request, Response } from 'express'

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id: string
  } // or any other type
}
// Middleware to create audit logs
export const auditLog = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const { method, originalUrl } = req
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  res.on('finish', async () => {
    const user = req.user
    console.log(user.id)
    await prisma.auditLog.create({
      data: {
        action: `${method} ${originalUrl}`,
        model: 'General',
        modelId: 0,
        belongsToId: user.id,
        ipAdress: ipAddress
      }
    })
  })
  next()
}
