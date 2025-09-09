import axios from 'axios'

interface MessageConfig {
  apiUrl: string
  apiKey: string
  instance: string
}

interface MessageData {
  number: string
  text: string
}

export class MessageService {
  private config: MessageConfig

  constructor() {
    this.config = {
      apiUrl: process.env.EVOLUTION_API_URL,
      apiKey: process.env.EVOLUTION_API_KEY,
      instance: process.env.MESSAGE_INSTANCE
    }
  }

  async sendMessage(messageData: MessageData): Promise<any> {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.config.apiUrl}/message/sendText/${this.config.instance}`,
      headers: {
        apikey: this.config.apiKey
      },
      data: messageData
    }

    try {
      const response = await axios.request(config)
      return response.data
    } catch (error) {
      console.error('Message sending failed:', error)
      throw error
    }
  }
}
