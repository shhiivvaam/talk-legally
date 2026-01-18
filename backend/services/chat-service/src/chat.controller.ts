import { Controller, Get, Param, Put, Query, UseGuards, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly messageService: MessageService) { }

    @Get(':sessionId/messages')
    async getMessages(
        @Param('sessionId') sessionId: string,
        @Query('limit') limit: number = 50,
        @Query('offset') offset: number = 0,
    ) {
        return this.messageService.getMessages(sessionId, limit, offset);
    }

    @Put('messages/:messageId/read')
    async markAsRead(@Param('messageId') messageId: string) {
        return this.messageService.markAsRead(messageId);
    }
}
