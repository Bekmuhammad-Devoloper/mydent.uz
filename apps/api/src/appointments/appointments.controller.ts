import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Book appointment (user/bot)' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  findById(@Param('id') id: string) {
    return this.appointmentsService.findById(id);
  }

  @Get('by-doctor/:doctorId')
  @ApiOperation({ summary: 'Get appointments by doctor' })
  findByDoctor(
    @Param('doctorId') doctorId: string,
    @Query('date') date?: string,
  ) {
    return this.appointmentsService.findByDoctor(doctorId, date);
  }
}
