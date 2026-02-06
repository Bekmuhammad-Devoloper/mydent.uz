import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClinicsService } from './clinics.service';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get('by-region/:regionId')
  @ApiOperation({ summary: 'List clinics by region (for user/bot)' })
  findByRegion(@Param('regionId') regionId: string) {
    return this.clinicsService.findByRegion(regionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinic details' })
  findById(@Param('id') id: string) {
    return this.clinicsService.findById(id);
  }

  @Get(':id/specialties')
  @ApiOperation({ summary: 'Get specialties available in a clinic' })
  getSpecialties(@Param('id') id: string) {
    return this.clinicsService.getSpecialties(id);
  }
}
