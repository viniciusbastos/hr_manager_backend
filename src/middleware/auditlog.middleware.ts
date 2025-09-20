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
  const ipAddress = (Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for']) || req.connection.remoteAddress || ''
  res.on('finish', async () => {
    const user = req.user
    if (!user?.id) {
      console.warn('No user ID available for audit log')
      return
    }

    // Verify user exists before creating audit log
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!existingUser) {
      console.error(`User ${user.id} not found, cannot create audit log`)
      return
    }

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
