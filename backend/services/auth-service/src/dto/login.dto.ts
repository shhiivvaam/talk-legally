import { IsEmail, IsString, IsOptional, ValidateIf } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @ValidateIf((o) => !o.email && !o.phone)
  @IsString()
  password?: string;
}
