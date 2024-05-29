import multer from 'multer';
import pdfParse from 'pdf-parse';
import axios from 'axios';
import { PineconeClient }  from 'pinecone-client';
import app from '../server';


// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

type Metadata = {}
// Initialize Pinecone
const pinecone = new PineconeClient<Metadata>({
     apiKey: process.env.PINECONE_API_KEY,
     baseUrl: process.env.PINECONE_BASE_URL,
     namespace: 'testing',

});


 export const uploadfiles = app.post('/upload', upload.single('pdf'), async (req: any, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const data = await pdfParse(fileBuffer);
    const text = data.text;


    // Send text to Google Gemini API for embeddings
    const geminiResponse = await axios.post('https://gemini.googleapis.com/v1/embeddings', {
      text,
    }, {
      headers: { Authorization: `Bearer AIzaSyBSsdq9HrzHXoP6L2rGfuRfQpajkE58DfY` },
    });

    const embeddings = geminiResponse.data.embeddings;

    // Store embeddings in Pinecone
    await pinecone.upsert({
      vectors: [{ id: req.file.filename, values: embeddings }],
    });

    res.status(200).send('PDF uploaded and processed.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing PDF.');
  }
});