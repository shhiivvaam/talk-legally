import { IsString, IsNumber, IsArray, IsEnum, IsOptional, Min } from 'class-validator';
import { AvailabilityStatus } from '@shared/types';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialization?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsNumber()
  locationLatitude?: number;

  @IsOptional()
  @IsNumber()
  locationLongitude?: number;
}

export class UpdatePricingDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  chatPricePerMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  voicePricePerMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  videoPricePerMin?: number;
}

export class UpdateAvailabilityDto {
  @IsEnum(AvailabilityStatus)
  availabilityStatus: AvailabilityStatus;
}
