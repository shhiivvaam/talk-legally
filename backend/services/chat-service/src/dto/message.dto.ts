import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsEnum(['user', 'lawyer'])
  senderType: 'user' | 'lawyer';

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(['text', 'file'])
  @IsOptional()
  messageType?: 'text' | 'file';

  @IsString()
  @IsOptional()
  fileUrl?: string;
}
