import { Router } from 'express'
import { url } from 'inspector'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const auditLogsnoteRouter = Router()

auditLogsnoteRouter.post('/audit-logs', async (req, res) => {
  const { action, model, modelId, belongsToId, ipAdress } = req.body
  const auditLog = await prisma.auditLog.create({
    data: {
      action,
      model,
      modelId,
      belongsToId,
      ipAdress
    }
  })
  res.json(auditLog)
})

// Read all audit logs
auditLogsnoteRouter.get('/audit-logs', async (req, res) => {
  const auditLogs = await prisma.auditLog.findMany()
  res.json(auditLogs)
})

// Read a single audit log by ID
auditLogsnoteRouter.get('/audit-logs/:id', async (req, res) => {
  const { id } = req.params
  const auditLog = await prisma.auditLog.findUnique({
    where: { id: parseInt(id) }
  })
  res.json(auditLog)
})

// Update an audit log by ID
auditLogsnoteRouter.put('/audit-logs/:id', async (req, res) => {
  const { id } = req.params
  const { action, model, modelId, belongsToId, ipAdress } = req.body
  const auditLog = await prisma.auditLog.update({
    where: { id: parseInt(id) },
    data: {
      action,
      model,
      modelId,
      belongsToId,
      ipAdress
    }
  })
  res.json(auditLog)
})

auditLogsnoteRouter.delete('/audit-logs/:id', async (req, res) => {
  const { id } = req.params
  await prisma.auditLog.delete({
    where: { id: parseInt(id) }
  })
  res.json({ message: 'Audit log deleted' })
})

export default auditLogsnoteRouter
