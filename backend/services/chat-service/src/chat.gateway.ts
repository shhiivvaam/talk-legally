import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    await this.chatService.handleDisconnect(client.id);
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.chatService.joinSession(client.id, data.sessionId, data.userId);
    client.join(`session:${data.sessionId}`);
    return { success: true, sessionId: data.sessionId };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messageService.saveMessage(
      sendMessageDto.sessionId,
      sendMessageDto.senderId,
      sendMessageDto.senderType,
      sendMessageDto.message,
      sendMessageDto.messageType,
      sendMessageDto.fileUrl,
    );

    // Broadcast to all clients in the session
    this.server.to(`session:${sendMessageDto.sessionId}`).emit('receive_message', message);

    return { success: true, message };
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { sessionId: string; userId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`session:${data.sessionId}`).emit('typing', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('read_receipt')
  async handleReadReceipt(
    @MessageBody() data: { sessionId: string; messageId: string },
  ) {
    await this.messageService.markAsRead(data.messageId);
    this.server.to(`session:${data.sessionId}`).emit('message_read', {
      messageId: data.messageId,
    });
  }
}
