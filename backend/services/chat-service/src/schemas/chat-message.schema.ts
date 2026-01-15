import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatMessage extends Document {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true, enum: ['user', 'lawyer'] })
  senderType: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: ['text', 'file'], default: 'text' })
  messageType: string;

  @Prop()
  fileUrl: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: false })
  isRead: boolean;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
