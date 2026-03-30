import { Injectable, BadRequestException } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayProvider {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }

  async createOrder(amount: number, userId: string) {
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${userId}_${Date.now()}`,
        notes: {
          userId,
        },
      };

      const order = await this.razorpay.orders.create(options);

      return {
        orderId: order.id,
        amount: Number(order.amount) / 100,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Razorpay order creation failed: ${message}`);
    }
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      const text = `${orderId}|${paymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(text)
        .digest('hex');

      if (generatedSignature === signature) {
        // Fetch payment details
        const payment = await this.razorpay.payments.fetch(paymentId);
        return payment.status === 'captured';
      }

      return false;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Payment verification failed: ${message}`);
    }
  }

  async handleWebhook(body: Record<string, unknown>, signature: string) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const text = JSON.stringify(body);
    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(text)
      .digest('hex');

    if (generatedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = body.event;
    const payload = body.payload as Record<string, Record<string, Record<string, unknown>>> | undefined;
    const payment = payload?.payment?.entity;

    if (event === 'payment.captured' && payment) {
      return {
        paymentId: payment.id,
        orderId: payment.order_id,
        amount: Number(payment.amount) / 100,
        status: 'success',
      };
    }

    return { status: 'ignored' };
  }
}
