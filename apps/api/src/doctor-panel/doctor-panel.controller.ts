import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DoctorPanelService } from './doctor-panel.service';
import { CreateManualAppointmentDto } from './dto/create-manual-appointment.dto';
import { CreateTimeoffDto } from './dto/create-timeoff.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

@ApiTags('Doctor Panel')
@Controller('doctor-panel')
export class DoctorPanelController {
  constructor(private readonly doctorPanelService: DoctorPanelService) {}

  // ─── Auth ───────────────────────────────────────────

  @Post('login')
  @ApiOperation({ summary: 'Doctor login' })
  login(@Body() body: { phone: string; password: string }) {
    return this.doctorPanelService.login(body.phone, body.password);
  }

  // ─── Appointments ───────────────────────────────────

  @Get(':doctorId/appointments')
  @ApiOperation({ summary: 'Get doctor appointments' })
  getMyAppointments(
    @Param('doctorId') doctorId: string,
    @Query('date') date?: string,
  ) {
    return this.doctorPanelService.getMyAppointments(doctorId, date);
  }

  @Put(':doctorId/appointments/:appointmentId/status')
  @ApiOperation({ summary: 'Update appointment status (accept/complete/cancel)' })
  updateAppointmentStatus(
    @Param('doctorId') doctorId: string,
    @Param('appointmentId') appointmentId: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.doctorPanelService.updateAppointmentStatus(
      doctorId,
      appointmentId,
      dto,
    );
  }

  @Put(':doctorId/appointments/:appointmentId/cancel')
  @ApiOperation({ summary: 'Cancel appointment' })
  cancelAppointment(
    @Param('doctorId') doctorId: string,
    @Param('appointmentId') appointmentId: string,
  ) {
    return this.doctorPanelService.cancelAppointment(doctorId, appointmentId);
  }

  // ─── Manual Appointment ─────────────────────────────

  @Post(':doctorId/appointments/manual')
  @ApiOperation({ summary: 'Add patient manually' })
  createManualAppointment(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateManualAppointmentDto,
  ) {
    return this.doctorPanelService.createManualAppointment(doctorId, dto);
  }

  // ─── Schedule ───────────────────────────────────────

  @Get(':doctorId/schedule')
  @ApiOperation({ summary: 'Get doctor schedule' })
  getSchedule(@Param('doctorId') doctorId: string) {
    return this.doctorPanelService.getSchedule(doctorId);
  }

  @Put(':doctorId/schedule/:dayOfWeek')
  @ApiOperation({ summary: 'Set schedule for a day' })
  upsertSchedule(
    @Param('doctorId') doctorId: string,
    @Param('dayOfWeek') dayOfWeek: string,
    @Body() body: { startTime: string; endTime: string },
  ) {
    return this.doctorPanelService.upsertSchedule(
      doctorId,
      parseInt(dayOfWeek),
      body.startTime,
      body.endTime,
    );
  }

  @Delete(':doctorId/schedule/:dayOfWeek')
  @ApiOperation({ summary: 'Remove schedule for a day' })
  deleteScheduleDay(
    @Param('doctorId') doctorId: string,
    @Param('dayOfWeek') dayOfWeek: string,
  ) {
    return this.doctorPanelService.deleteScheduleDay(
      doctorId,
      parseInt(dayOfWeek),
    );
  }

  // ─── Time Off ───────────────────────────────────────

  @Get(':doctorId/timeoffs')
  @ApiOperation({ summary: 'Get doctor time offs' })
  getTimeOffs(@Param('doctorId') doctorId: string) {
    return this.doctorPanelService.getTimeOffs(doctorId);
  }

  @Post(':doctorId/timeoffs')
  @ApiOperation({ summary: 'Create time off' })
  createTimeOff(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateTimeoffDto,
  ) {
    return this.doctorPanelService.createTimeOff(doctorId, dto);
  }

  @Delete(':doctorId/timeoffs/:timeOffId')
  @ApiOperation({ summary: 'Delete time off' })
  deleteTimeOff(
    @Param('doctorId') doctorId: string,
    @Param('timeOffId') timeOffId: string,
  ) {
    return this.doctorPanelService.deleteTimeOff(doctorId, timeOffId);
  }

  // ─── Settings ───────────────────────────────────────

  @Get(':doctorId/settings')
  @ApiOperation({ summary: 'Get doctor settings (price, avgServiceMin)' })
  getSettings(@Param('doctorId') doctorId: string) {
    return this.doctorPanelService.getSettings(doctorId);
  }

  @Put(':doctorId/settings')
  @ApiOperation({ summary: 'Update doctor settings' })
  updateSettings(
    @Param('doctorId') doctorId: string,
    @Body() body: { price?: number; avgServiceMin?: number },
  ) {
    return this.doctorPanelService.updateSettings(doctorId, body);
  }

  // ─── Available Slots ────────────────────────────────

  @Get(':doctorId/slots')
  @ApiOperation({ summary: 'Get available slots for a date' })
  getAvailableSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.doctorPanelService.getAvailableSlots(doctorId, date);
  }
}
