import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(dto: CreateUserDto) {
    return this.prisma.user.upsert({
      where: { phone: dto.phone },
      create: dto,
      update: dto,
    });
  }

  async findByPhone(phone: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getMyAppointments(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      include: {
        doctor: { include: { clinic: true } },
        diagnosis: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async getMyDiagnoses(userId: string) {
    return this.prisma.diagnosis.findMany({
      where: { appointment: { userId } },
      include: {
        doctor: true,
        appointment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelAppointment(userId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, userId },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
    });
  }
}
