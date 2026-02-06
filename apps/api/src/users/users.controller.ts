import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register or update user (bot)' })
  register(@Body() dto: CreateUserDto) {
    return this.usersService.createOrUpdate(dto);
  }

  @Get('by-phone/:phone')
  @ApiOperation({ summary: 'Get user by phone' })
  findByPhone(@Param('phone') phone: string) {
    return this.usersService.findByPhone(phone);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get(':id/appointments')
  @ApiOperation({ summary: 'Get user appointments' })
  getMyAppointments(@Param('id') id: string) {
    return this.usersService.getMyAppointments(id);
  }

  @Get(':id/diagnoses')
  @ApiOperation({ summary: 'Get user diagnoses' })
  getMyDiagnoses(@Param('id') id: string) {
    return this.usersService.getMyDiagnoses(id);
  }

  @Put(':userId/appointments/:appointmentId/cancel')
  @ApiOperation({ summary: 'Cancel user appointment' })
  cancelAppointment(
    @Param('userId') userId: string,
    @Param('appointmentId') appointmentId: string,
  ) {
    return this.usersService.cancelAppointment(userId, appointmentId);
  }
}
