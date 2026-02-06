import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTimeoffDto {
  @ApiProperty({ example: '2026-02-15', description: 'Date (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ example: '09:00', description: 'Start time (null = full day)' })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ example: '12:00', description: 'End time (null = full day)' })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ example: 'Dam olish' })
  @IsString()
  @IsOptional()
  reason?: string;
}
