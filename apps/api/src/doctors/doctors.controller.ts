import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get('by-clinic/:clinicId')
  @ApiOperation({ summary: 'List doctors by clinic and specialty' })
  findByClinicAndSpecialty(
    @Param('clinicId') clinicId: string,
    @Query('specialty') specialty: string,
  ) {
    return this.doctorsService.findByClinicAndSpecialty(clinicId, specialty);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor details' })
  findById(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }

  @Get(':id/slots')
  @ApiOperation({ summary: 'Get available slots for a doctor on a date' })
  getAvailableSlots(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return this.doctorsService.getAvailableSlots(id, date);
  }
}
