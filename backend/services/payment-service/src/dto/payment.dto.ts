import { IsNumber, IsString, IsEnum, Min, IsNotEmpty } from 'class-validator';
import { PaymentGateway } from '@shared/types';

export class CreateOrderDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;
}

export class VerifyPaymentDto {
  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
