import { IsString, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class SendNotificationDto {
  @IsArray()
  @IsString({ each: true })
  userIds?: string[];

  @IsArray()
  @IsString({ each: true })
  emailAddresses?: string[];

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  htmlBody?: string;

  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @IsOptional()
  data?: any;
}
