import express from 'express'
import router from './router.js'
import { PrismaClient } from '@prisma/client'

const app = express()
import cors from 'cors'
import morgan from 'morgan'
import { protect } from './modules/auth.js'
import { createUser, signin } from './handlers/userHandlers.js'
import usersRouter from './routes/users.routes.js'
import vacationRouter from './routes/vacations.routes.js'
import sicknoteRouter from './routes/sicknote.routes.js'
import weaponsRouter from './routes/weapons.routes.js'
import adminMiddleware from './middleware/admins.middleware.js'
import { auditLog } from './middleware/auditlog.middleware.js'
import vacationPlanRouter from './routes/vacationsPlan.routes.js'
import auditLogsnoteRouter from './routes/auditlogs.routes.js'
import pino from 'pino'
import { Redis } from 'iovalkey'

import {
  CacheCase,
  PrismaExtensionRedis,
  type AutoCacheConfig,
  type CacheConfig
} from 'prisma-extension-redis'
// import whatsappRouter from './routes/whatsapp.routes'

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 👇️ specify origins to allow
const whitelist = ['https://app.bastosdev.xyz', 'http://localhost:4173']

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// ✅ Enable pre-flight requests with same options
app.options('*', cors(corsOptions))

app.use(cors(corsOptions))

app.post('/api/user', createUser)
app.post('/api/signin', signin)

app.use('/api', protect, [adminMiddleware, auditLog], router)
app.use('/api', protect, [adminMiddleware, auditLog], usersRouter)
app.use('/api', protect, [adminMiddleware], auditLogsnoteRouter)
app.use('/api', protect, [adminMiddleware, auditLog], vacationRouter)
app.use('/api', protect, [adminMiddleware, auditLog], sicknoteRouter)
app.use('/api', protect, [adminMiddleware, auditLog], weaponsRouter)
app.use('/api', protect, [adminMiddleware, auditLog], vacationPlanRouter)
// app.use('/api', whatsappRouter)

app.use((err: any, req: any, res: any, next: any) => {
  if (err.type === 'auth') {
    res.status(401).json({ message: `unauthorized` })
  } else if (err.type === 'input') {
    res.status(400).json({ message: `input error` })
  } else {
    res.status(500).json({ message: `had an error: ${err.message}` })
  }
})

export default app
