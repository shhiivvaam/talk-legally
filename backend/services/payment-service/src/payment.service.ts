import { Injectable, BadRequestException } from '@nestjs/common';
import { RazorpayProvider } from './providers/razorpay.provider';
import { PaytmProvider } from './providers/paytm.provider';
import { PaymentGateway } from '@shared/types';

@Injectable()
export class PaymentService {
  constructor(
    private razorpayProvider: RazorpayProvider,
    private paytmProvider: PaytmProvider,
  ) {}

  async createOrder(amount: number, userId: string, gateway: PaymentGateway) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    switch (gateway) {
      case PaymentGateway.RAZORPAY:
        return this.razorpayProvider.createOrder(amount, userId);
      case PaymentGateway.PAYTM:
        return this.paytmProvider.createOrder(amount, userId);
      default:
        throw new BadRequestException('Invalid payment gateway');
    }
  }

  async verifyPayment(
    gateway: PaymentGateway,
    paymentId: string,
    orderId: string,
    signature?: string,
  ) {
    switch (gateway) {
      case PaymentGateway.RAZORPAY:
        if (!signature) {
          throw new BadRequestException('Signature is required for Razorpay');
        }
        return this.razorpayProvider.verifyPayment(paymentId, orderId, signature);
      case PaymentGateway.PAYTM:
        return this.paytmProvider.verifyPayment(paymentId, orderId);
      default:
        throw new BadRequestException('Invalid payment gateway');
    }
  }

  async handleRazorpayWebhook(body: any, signature: string) {
    return this.razorpayProvider.handleWebhook(body, signature);
  }

  async handlePaytmWebhook(body: any) {
    return this.paytmProvider.handleWebhook(body);
  }
}
