import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const comparePasswords = (password: any, hash: any) => {
  return bcrypt.compare(password, hash)
}

export const hashPassword = (password: any) => {
  return bcrypt.hash(password, 5)
}

export const createJWT = (user: { id: any; email: any, role: string, name: string, posto: string }) => {
  let sec: string = process.env.JWT_SECRET as string
  
  const token = jwt.sign(
    {
      id: user.id,
      useremail: user.email,
      role: user.role,
      name: user.name,
      posto: user.posto

    },
    sec,
    { expiresIn: '30d' }
  )
  return token
}

export const protect = (req: any, res: any, next: any) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    res.status(401)
    res.json({ message: 'not authorized' })
    return
  }

  const [, token] = bearer.split(' ')

  if (!token) {
    res.status(401)
    res.json({ message: 'not valid token' })
    return
  }

  try {
    let sec: string = process.env.JWT_SECRET as string
    const user = jwt.verify(token, sec)
    req.user = user
    next()
  } catch (e) {
    console.error(e)
    res.status(401)
    res.json({ message: 'not valid token' })
    return
  }
}
