import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export interface IGetUserAuthInfoRequest extends Request {
    user: {
        role: string
    } // or any other type
  }

const adminMiddleware = async(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    
      const user = req.user
       if(user.role == "ADMIN"){
        next()
       }
       else{
        console.log('error')
       }
    

}
export default adminMiddleware