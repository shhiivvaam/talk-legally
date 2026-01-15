import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '@shared/database/mongodb.config';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => getMongoConfig(),
    }),
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService, MessageService],
  exports: [ChatService, MessageService],
})
export class AppModule {}
