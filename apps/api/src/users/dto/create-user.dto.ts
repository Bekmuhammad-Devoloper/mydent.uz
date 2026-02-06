import {
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Language } from '@prisma/client';

export class CreateUserDto {
  @ApiPropertyOptional({ example: '+998901234567' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'Ali' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Valiyev' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ enum: Language, default: Language.UZ })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @ApiPropertyOptional({ description: 'Region ID' })
  @IsString()
  @IsOptional()
  regionId?: string;
}
