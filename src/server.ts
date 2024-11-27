import express from 'express'
import router from './router'

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'stdout',
      level: 'error'
    },
    {
      emit: 'stdout',
      level: 'info'
    },
    {
      emit: 'stdout',
      level: 'warn'
    }
  ]
})
const app = express()
import cors from 'cors'
import morgan from 'morgan'
import { protect } from './modules/auth'
import { createUser, signin } from './handlers/userHandlers'
import usersRouter from './routes/users.routes'
import vacationRouter from './routes/vacation.routes'
import sicknoteRouter from './routes/sicknote.routes'
import weaponsRouter from './routes/weapons.routes'
import adminMiddleware from './middleware/admins.middleware'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { auditLog } from './middleware/auditlog.middleware'
import uploadRouter from './testes3'
import whatsappRouter from './routes/whatsapp.routes'






const genAi = new GoogleGenerativeAI(process.env.GEMINI_API)




app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 👇️ specify origins to allow
const whitelist = ['https://app.bastosdev.info', 'https://6cipm-hrmanager.netlify.app', 'http://localhost:4173'];

// ✅ Enable pre-flight requests
app.options('*', cors());

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
console.log(corsOptions)

app.use(cors(corsOptions));

app.post('/api/user', createUser)
app.post('/api/signin', signin)

app.use('/api', protect, [adminMiddleware,auditLog], router)
app.use('/api', protect,[adminMiddleware,auditLog], usersRouter)
app.use('/api', protect,[adminMiddleware,auditLog], vacationRouter)
app.use('/api', protect,[adminMiddleware,auditLog], sicknoteRouter)
app.use('/api', protect,[adminMiddleware,auditLog], weaponsRouter)
app.use('/api', uploadRouter)
app.use('/api', whatsappRouter)


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
