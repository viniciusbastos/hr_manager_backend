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


app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

app.post('/api/user', createUser)
app.post('/api/signin', signin)

app.use('/api', protect, router)
app.use('/api', protect, usersRouter)
app.use('/api', protect, vacationRouter)


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
