import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Doctor ID' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ example: '2026-02-10', description: 'Appointment date (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '09:00', description: 'Start time (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '09:30', description: 'End time (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiPropertyOptional({ description: 'User ID (for bot users)' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ example: 'Ali Valiyev', description: 'Patient name (for manual)' })
  @IsString()
  @IsOptional()
  patientName?: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Patient phone (for manual)' })
  @IsString()
  @IsOptional()
  patientPhone?: string;
}
