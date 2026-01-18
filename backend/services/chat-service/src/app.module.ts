import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '@shared/database/mongodb.config';
import { LoggerModule } from '@shared/utils/logger.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message.schema';
import { ChatController } from './chat.controller';
import { SharedAuthModule } from '@shared/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedAuthModule,
    LoggerModule,
    MongooseModule.forRootAsync({
      useFactory: () => getMongoConfig(),
    }),
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, MessageService],
  exports: [ChatService, MessageService],
})
export class AppModule { }
