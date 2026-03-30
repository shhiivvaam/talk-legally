import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SendOtpDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;
}

export class SendEmailOtpDto {
    @IsEmail()
    email: string;
}

export class SendPhoneOtpDto {
    @IsString()
    phone: string;
}
