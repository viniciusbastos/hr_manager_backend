// import { Request, Response, Router } from 'express'
// import { PrismaClient } from '@prisma/client'
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
// import { v4 as uuidv4 } from 'uuid'
// import multer from 'multer'
// import path from 'path'

// const prisma = new PrismaClient()
// const uploadRouter = Router()
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
//   }
// })

// uploadRouter.post('/upload', async (req, res) => {
//   const upload = multer({
//     storage: multer.memoryStorage(),
//     fileFilter: (req, file, cb) => {
//       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif']
//       if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true)
//       } else {
//         cb(new Error('Invalid file type'))
//       }
//     },
//     limits: {
//       fileSize: 10 * 1024 * 1024 // 10MB limit
//     }
//   })

//   try {
//     upload.single('file')(req, res, async err => {
//       if (err instanceof multer.MulterError) {
//         return res.status(400).json({ error: 'File upload error', details: err.message })
//       } else if (err) {
//         return res.status(400).json({ error: 'Invalid file type' })
//       }

//       if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' })
//       }

//       const file = req.file
//       const fileExtension = path.extname(file.originalname)
//       const fileName = `${uuidv4()}${fileExtension}`

//       const uploadParams = {
//         Bucket: process.env.S3_BUCKET_NAME!,
//         Key: fileName,
//         Body: file.buffer,
//         ContentType: file.mimetype
//       }

//       try {
//         const uploadResult = await s3Client.send(new PutObjectCommand(uploadParams))

//         // Save file metadata to database
//         // const fileRecord = await prisma.uploadedFile.create({
//         //   data: {
//         //     fileName: fileName,
//         //     originalName: file.originalname,
//         //     mimetype: file.mimetype,
//         //     size: file.size,
//         //     s3Key: fileName,
//         //     s3Bucket: process.env.S3_BUCKET_NAME!
//         //   }
//         // });

//         const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`

//         res.status(200).json({
//           message: 'File uploaded successfully',
//           fileUrl: fileUrl,
//           fileId: fileRecord.id
//         })
//       } catch (s3Error) {
//         console.error('S3 Upload Error:', s3Error)
//         res.status(500).json({ error: 'Failed to upload file to S3' })
//       }
//     })
//   } catch (error) {
//     console.error('Upload Controller Error:', error)
//     res.status(500).json({ error: 'Internal server error' })
//   }
// })

// export default uploadRouter
