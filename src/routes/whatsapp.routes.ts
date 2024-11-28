// import { Router } from 'express'
// import { whatsappClient } from '../whatsapp';

// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()
// const whatsappRouter = Router()
// const { MessageMedia } = require('whatsapp-web.js');



// whatsappRouter.post('/send-message', async (req, res) => {
//     const { to, message } = req.body;
//     try {
//       await whatsappClient.sendMessage(to, message);
//       res.json({ success: true, message: 'Message sent successfully' });
//     } catch (error) {
//       res.status(500).json({ success: false, error: (error as Error).message });
//     }
//   });
//   whatsappRouter.post('/send-file', async (req, res) => {
//     const { to, filePath, caption } = req.body;
  
//     if (!to || !filePath) {
//       return res.status(400).json({ error: 'Missing required parameters' });
//     }
  
//     const success = await whatsappClient.sendFile(to, filePath, caption);
  
//     if (success) {
//       res.json({ message: 'File sent successfully' });
//     } else {
//       res.status(500).json({ error: 'Failed to send file' });
//     }
//   });

//   export default whatsappRouter;