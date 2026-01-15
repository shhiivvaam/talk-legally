import { Controller, Post, Body, Get, Query, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.paymentService.createOrder(
      createOrderDto.amount,
      createOrderDto.userId,
      createOrderDto.gateway,
    );
  }

  @Post('verify')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(
      verifyPaymentDto.gateway,
      verifyPaymentDto.paymentId,
      verifyPaymentDto.orderId,
      verifyPaymentDto.signature,
    );
  }

  @Post('webhook/razorpay')
  async razorpayWebhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
    return this.paymentService.handleRazorpayWebhook(body, signature);
  }

  @Post('webhook/paytm')
  async paytmWebhook(@Body() body: any) {
    return this.paymentService.handlePaytmWebhook(body);
  }
}
