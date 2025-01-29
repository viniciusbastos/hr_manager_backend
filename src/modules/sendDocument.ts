import axios from 'axios'

/**
 * Sends a document to a specified number via API
 * @param {string} recipientNumber - Recipient phone number with country code
 * @param {string} fileName - Name of the file being sent
 * @param {string} base64PDF - Base64 encoded string of the PDF document
 * @param {object} [options] - Optional configuration parameters
 * @returns {Promise} Promise that resolves with API response or rejects with error
 */
// Define interfaces for type safety
interface SendDocumentOptions {
  mediatype?: string
  mimetype?: string
  url?: string
  apiKey?: string
}
interface APIRequestData {
  number: string
  mediatype: string
  mimetype: string
  caption: string
  media: string
  fileName: string
}
async function sendDocumentToNumber(
  recipientNumber: string,
  fileName: string,
  base64PDF: string,
  options: SendDocumentOptions = {}
): Promise<any> {
  // Validate required parameters
  if (!recipientNumber || !fileName || !base64PDF) {
    throw new Error('Missing required parameters')
  }

  const {
    mediatype = 'document',
    mimetype = 'application/pdf',
    url = process.env.EVOLUTION_API_URL
  } = options

  if (!url) {
    throw new Error('API URL is required either through options or environment variable')
  }

  const data: APIRequestData = {
    number: recipientNumber,
    mediatype,
    mimetype,
    caption: fileName,
    media: base64PDF,
    fileName
  }

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url,
    headers: {
      'Content-Type': 'application/json',
      apikey: options.apiKey || process.env.EVOLUTION_API_KEY
    },
    data: JSON.stringify(data)
  }
  try {
    return await axios(config)
  } catch (error) {
    console.error('Error sending document:', error)
    throw error
  }
}

export default sendDocumentToNumber
