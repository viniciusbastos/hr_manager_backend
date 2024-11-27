import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import path from 'path';

 class WhatsAppClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth()
    });

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('Client is ready!');
    });

    this.client.initialize();
  }

  public async sendMessage(to: string, message: string) {
    const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
    return this.client.sendMessage(chatId, message);
  }

  async sendFile(to: string, filePath: string, caption?: string) {
    try {
      const media = MessageMedia.fromFilePath(filePath);
      await this.client.sendMessage(to, media, { caption });
      return true;
    } catch (error) {
      console.error('Error sending file:', error);
      return false;
    }
  }
}

export const whatsappClient = new WhatsAppClient();