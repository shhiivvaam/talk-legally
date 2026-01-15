import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async send(to: string[], subject: string, text: string, html?: string) {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@talklegally.com',
      subject,
      text,
      html: html || text,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }
  }
}
