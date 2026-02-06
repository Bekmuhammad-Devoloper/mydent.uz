import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ example: 'Alisher' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Karimov' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({ example: '101', description: 'Room number' })
  @IsString()
  @IsOptional()
  room?: string;

  @ApiProperty({ description: 'Specialty ID' })
  @IsString()
  @IsNotEmpty()
  specialtyId: string;

  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @Min(0)
  @IsOptional()
  experienceYears?: number;

  @ApiPropertyOptional({ example: 100000 })
  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 30, description: 'Average service time in minutes' })
  @IsInt()
  @Min(10)
  @IsOptional()
  avgServiceMin?: number;

  @ApiProperty({ description: 'Clinic ID' })
  @IsString()
  @IsNotEmpty()
  clinicId: string;
}
