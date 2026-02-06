import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    // Check if slot is available
    const existing = await this.prisma.appointment.findFirst({
      where: {
        doctorId: dto.doctorId,
        date: new Date(dto.date),
        startTime: dto.startTime,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });
    if (existing) {
      throw new ConflictException('Bu vaqt allaqachon band');
    }

    // Check time off
    const timeOff = await this.prisma.timeOff.findFirst({
      where: {
        doctorId: dto.doctorId,
        date: new Date(dto.date),
        OR: [
          { startTime: null, endTime: null }, // full day off
          {
            startTime: { lte: dto.startTime },
            endTime: { gte: dto.endTime },
          },
        ],
      },
    });
    if (timeOff) {
      throw new ConflictException('Shifokor dam olish kunida — navbat olib bo\'lmaydi');
    }

    return this.prisma.appointment.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
      include: { doctor: { include: { clinic: true } } },
    });
  }

  async findById(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { clinic: true } },
        user: true,
        diagnosis: true,
      },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async findByDoctor(doctorId: string, date?: string) {
    const where: any = { doctorId };
    if (date) where.date = new Date(date);
    return this.prisma.appointment.findMany({
      where,
      include: { user: true, diagnosis: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }
}
