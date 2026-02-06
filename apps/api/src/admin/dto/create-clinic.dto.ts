import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClinicDto {
  @ApiProperty({ example: 'MedLine Clinic' })
  @IsString()
  @IsNotEmpty()
  nameUz: string;

  @ApiProperty({ example: 'Клиника МедЛайн' })
  @IsString()
  @IsNotEmpty()
  nameRu: string;

  @ApiPropertyOptional({ example: 'Toshkent sh., Chilonzor t.' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Region ID' })
  @IsString()
  @IsNotEmpty()
  regionId: string;
}
