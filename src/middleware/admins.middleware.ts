import { NextFunction, Request, Response } from 'express'

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    role: string
  }
}

const adminMiddleware = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const user = req.user
  if (user.role === 'ADMIN') {
    next()
  } else {
    res.status(403).json({ message: 'Forbidden. Admin access required.' })
  }
}

export default adminMiddleware
