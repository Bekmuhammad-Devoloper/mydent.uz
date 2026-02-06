import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateAppointmentStatusDto {
  @ApiProperty({ enum: AppointmentStatus })
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status: AppointmentStatus;

  @ApiPropertyOptional({ description: 'Diagnosis / notes when completing' })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({ description: 'Prescription (medications) when completing' })
  @IsString()
  @IsOptional()
  prescription?: string;

  @ApiPropertyOptional({ description: 'Final price (if different from default)' })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  finalPrice?: number;
}
