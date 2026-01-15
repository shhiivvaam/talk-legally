import { IsEnum, IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { SessionType } from '@shared/types';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  lawyerId: string;

  @IsEnum(SessionType)
  sessionType: SessionType;
}

export class HeartbeatDto {
  @IsNumber()
  durationSeconds: number;
}
