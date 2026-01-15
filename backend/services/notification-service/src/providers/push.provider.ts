import { Injectable } from '@nestjs/common';
import * as OneSignal from 'onesignal-node';

@Injectable()
export class PushProvider {
  private client: OneSignal.Client;

  constructor() {
    this.client = new OneSignal.Client(
      process.env.ONESIGNAL_APP_ID || '',
      process.env.ONESIGNAL_REST_API_KEY || '',
    );
  }

  async send(userIds: string[], title: string, body: string, data?: any) {
    const notification = {
      headings: { en: title },
      contents: { en: body },
      include_external_user_ids: userIds,
      data,
    };

    try {
      const response = await this.client.createNotification(notification);
      return { success: true, response };
    } catch (error) {
      console.error('Push notification error:', error);
      return { success: false, error: error.message };
    }
  }
}
