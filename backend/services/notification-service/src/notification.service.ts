import { Injectable } from '@nestjs/common';
import { PushProvider } from './providers/push.provider';
import { EmailProvider } from './providers/email.provider';
import { SendNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private pushProvider: PushProvider,
    private emailProvider: EmailProvider,
  ) {}

  async sendNotification(dto: SendNotificationDto) {
    const results = [];

    if (dto.push && dto.userIds && dto.userIds.length > 0) {
      const pushResult = await this.pushProvider.send(
        dto.userIds,
        dto.title,
        dto.body,
        dto.data,
      );
      results.push({ type: 'push', result: pushResult });
    }

    if (dto.email && dto.emailAddresses && dto.emailAddresses.length > 0) {
      const emailResult = await this.emailProvider.send(
        dto.emailAddresses,
        dto.subject || dto.title,
        dto.body,
        dto.htmlBody,
      );
      results.push({ type: 'email', result: emailResult });
    }

    return { success: true, results };
  }
}
