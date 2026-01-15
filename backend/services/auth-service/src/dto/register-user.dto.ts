import { IsEmail, IsString, IsOptional, MinLength, ValidateIf } from 'class-validator';

export class RegisterUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @ValidateIf((o) => !o.googleId)
  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}
