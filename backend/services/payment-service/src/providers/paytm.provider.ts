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
    } catch (error) {
      throw new BadRequestException(`Paytm order creation failed: ${error.message}`);
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
    } catch (error) {
      throw new BadRequestException(`Payment verification failed: ${error.message}`);
    }
  }

  async handleWebhook(body: any) {
    // Verify checksum
    const receivedChecksum = body.CHECKSUMHASH;
    delete body.CHECKSUMHASH;

    const calculatedChecksum = this.generateChecksum(body);

    if (calculatedChecksum !== receivedChecksum) {
      throw new BadRequestException('Invalid webhook checksum');
    }

    if (body.STATUS === 'TXN_SUCCESS') {
      return {
        paymentId: body.TXNID,
        orderId: body.ORDERID,
        amount: parseFloat(body.TXNAMOUNT),
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
