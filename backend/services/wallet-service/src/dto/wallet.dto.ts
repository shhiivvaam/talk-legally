import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class AddBalanceDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  referenceId?: string;
}

export class DeductBalanceDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
