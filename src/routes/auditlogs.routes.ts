import { Router } from 'express'
import { url } from 'inspector'
import prisma from '../db'
import extendedPrisma from '../db'

const auditLogsnoteRouter = Router()

auditLogsnoteRouter.post('/audit-logs', async (req, res) => {
  const { action, model, modelId, belongsToId, ipAdress } = req.body
  const auditLog = await extendedPrisma.auditLog.create({
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
  const auditLogs = await extendedPrisma.auditLog.findMany()
  res.json(auditLogs)
})

// Read a single audit log by ID
auditLogsnoteRouter.get('/audit-logs/:id', async (req, res) => {
  const { id } = req.params
  const auditLog = await extendedPrisma.auditLog.findUnique({
    where: { id: parseInt(id) }
  })
  res.json(auditLog)
})

// Update an audit log by ID
auditLogsnoteRouter.put('/audit-logs/:id', async (req, res) => {
  const { id } = req.params
  const { action, model, modelId, belongsToId, ipAdress } = req.body
  const auditLog = await extendedPrisma.auditLog.update({
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
  await extendedPrisma.auditLog.delete({
    where: { id: parseInt(id) }
  })
  res.json({ message: 'Audit log deleted' })
})

export default auditLogsnoteRouter
