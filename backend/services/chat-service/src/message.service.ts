import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './schemas/chat-message.schema';
import * as crypto from 'crypto';

@Injectable()
export class MessageService {
  private readonly encryptionKey: string;

  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessage>,
  ) {
    this.encryptionKey = process.env.CHAT_ENCRYPTION_KEY || 'default-key-change-in-production';
  }

  async saveMessage(
    sessionId: string,
    senderId: string,
    senderType: 'user' | 'lawyer',
    message: string,
    messageType: 'text' | 'file' = 'text',
    fileUrl?: string,
  ) {
    // Encrypt message
    const encryptedMessage = this.encrypt(message);

    const chatMessage = new this.chatMessageModel({
      sessionId,
      senderId,
      senderType,
      message: encryptedMessage,
      messageType,
      fileUrl,
      timestamp: new Date(),
      isRead: false,
    });

    return chatMessage.save();
  }

  async getMessages(sessionId: string, limit: number = 50, offset: number = 0) {
    const messages = await this.chatMessageModel
      .find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    // Decrypt messages
    return messages.map((msg) => ({
      ...msg.toObject(),
      message: this.decrypt(msg.message),
    }));
  }

  async markAsRead(messageId: string) {
    await this.chatMessageModel.findByIdAndUpdate(messageId, { isRead: true });
  }

  private encrypt(text: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
