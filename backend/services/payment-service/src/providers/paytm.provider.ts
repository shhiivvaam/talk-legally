import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaytmProvider {
  private merchantId: string;
  private merchantKey: string;
  private baseUrl: string;

  constructor() {
    this.merchantId = process.env.PAYTM_MERCHANT_ID || '';
    this.merchantKey = process.env.PAYTM_MERCHANT_KEY || '';
    this.baseUrl = process.env.PAYTM_ENV === 'production' 
      ? 'https://securegw.paytm.in' 
      : 'https://securegw-stage.paytm.in';
  }

  async createOrder(amount: number, userId: string) {
    try {
      const orderId = `ORDER_${userId}_${Date.now()}`;
      const params = {
        MID: this.merchantId,
        ORDER_ID: orderId,
        CUST_ID: userId,
        TXN_AMOUNT: amount.toString(),
        CHANNEL_ID: 'WEB',
        INDUSTRY_TYPE_ID: 'Retail',
        WEBSITE: 'WEBSTAGING',
        CALLBACK_URL: process.env.PAYTM_CALLBACK_URL || 'http://localhost:3000/payment/callback',
      };

      // Generate checksum
      const checksum = this.generateChecksum(params);

      return {
        orderId,
        amount,
        params: {
          ...params,
          CHECKSUMHASH: checksum,
        },
        url: `${this.baseUrl}/theia/processTransaction`,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Paytm order creation failed: ${message}`);
    }
  }

  async verifyPayment(paymentId: string, orderId: string): Promise<boolean> {
    try {
      const params = {
        MID: this.merchantId,
        ORDERID: orderId,
      };

      const checksum = this.generateChecksum(params);

      const response = await axios.post(
        `${this.baseUrl}/order/status`,
        {
          ...params,
          CHECKSUMHASH: checksum,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data;
      return data.STATUS === 'TXN_SUCCESS';
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Payment verification failed: ${message}`);
    }
  }

  async handleWebhook(body: Record<string, unknown>) {
    // Verify checksum
    const receivedChecksum = body.CHECKSUMHASH;
    const { CHECKSUMHASH: _, ...bodyWithoutChecksum } = body;

    const calculatedChecksum = this.generateChecksum(bodyWithoutChecksum as Record<string, string>);

    if (calculatedChecksum !== receivedChecksum) {
      throw new BadRequestException('Invalid webhook checksum');
    }

    if (bodyWithoutChecksum.STATUS === 'TXN_SUCCESS') {
      return {
        paymentId: bodyWithoutChecksum.TXNID,
        orderId: bodyWithoutChecksum.ORDERID,
        amount: parseFloat(String(bodyWithoutChecksum.TXNAMOUNT)),
        status: 'success',
      };
    }

    return { status: 'failed' };
  }

  private generateChecksum(params: Record<string, string>): string {
    const string = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    return crypto.createHash('sha256').update(string + this.merchantKey).digest('hex');
  }
}
