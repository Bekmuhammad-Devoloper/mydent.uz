import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateManualAppointmentDto } from './dto/create-manual-appointment.dto';
import { CreateTimeoffDto } from './dto/create-timeoff.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorPanelService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Auth ───────────────────────────────────────────

  async login(phone: string, password: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { phone },
      include: { clinic: true, specialty: true },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    const valid = await bcrypt.compare(password, doctor.password);
    if (!valid) throw new ConflictException('Invalid credentials');
    return {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      phone: doctor.phone,
      specialtyId: doctor.specialtyId,
      specialty: doctor.specialty,
      price: doctor.price,
      avgServiceMin: doctor.avgServiceMin,
      clinicId: doctor.clinicId,
      clinic: doctor.clinic,
    };
  }

  // ─── Appointments (My Patients) ─────────────────────

  async getMyAppointments(doctorId: string, date?: string) {
    const where: any = { doctorId };
    if (date) where.date = new Date(date);
    return this.prisma.appointment.findMany({
      where,
      include: { user: true, diagnosis: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async updateAppointmentStatus(
    doctorId: string,
    appointmentId: string,
    dto: UpdateAppointmentStatusDto,
  ) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, doctorId },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    // If completing with diagnosis
    if (dto.status === 'COMPLETED' && dto.diagnosis) {
      await this.prisma.diagnosis.upsert({
        where: { appointmentId },
        create: {
          appointmentId,
          doctorId,
          description: dto.diagnosis,
          prescription: dto.prescription || null,
        },
        update: {
          description: dto.diagnosis,
          prescription: dto.prescription || null,
        },
      });
    }

    const updateData: any = { status: dto.status };
    if (dto.finalPrice !== undefined && dto.finalPrice !== null) {
      updateData.finalPrice = dto.finalPrice;
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: { user: true, diagnosis: true },
    });
  }

  async cancelAppointment(doctorId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, doctorId },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
      include: { user: true },
    });
  }

  // ─── Manual Appointment (Doctor adds patient) ───────

  async createManualAppointment(
    doctorId: string,
    dto: CreateManualAppointmentDto,
  ) {
    // Check if slot is available
    const existing = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
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
        doctorId,
        date: new Date(dto.date),
        OR: [
          { startTime: null, endTime: null },
          {
            startTime: { lte: dto.startTime },
            endTime: { gte: dto.endTime },
          },
        ],
      },
    });
    if (timeOff) {
      throw new ConflictException('Bu kun dam olish kuni — navbat qo\'shib bo\'lmaydi');
    }

    return this.prisma.appointment.create({
      data: {
        doctorId,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
        patientName: dto.patientName,
        patientPhone: dto.patientPhone,
        status: 'ACCEPTED',
      },
    });
  }

  // ─── Schedule ───────────────────────────────────────

  async getSchedule(doctorId: string) {
    return this.prisma.schedule.findMany({
      where: { doctorId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async upsertSchedule(
    doctorId: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
  ) {
    return this.prisma.schedule.upsert({
      where: { doctorId_dayOfWeek: { doctorId, dayOfWeek } },
      create: { doctorId, dayOfWeek, startTime, endTime },
      update: { startTime, endTime },
    });
  }

  async deleteScheduleDay(doctorId: string, dayOfWeek: number) {
    return this.prisma.schedule.deleteMany({
      where: { doctorId, dayOfWeek },
    });
  }

  // ─── Time Off ───────────────────────────────────────

  async getTimeOffs(doctorId: string) {
    return this.prisma.timeOff.findMany({
      where: { doctorId },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async createTimeOff(doctorId: string, dto: CreateTimeoffDto) {
    const dateObj = new Date(dto.date);

    // Check if there are booked appointments in this time range
    const whereCondition: any = {
      doctorId,
      date: dateObj,
      status: { in: ['PENDING', 'ACCEPTED'] },
    };

    if (dto.startTime && dto.endTime) {
      // Partial day off - check overlapping appointments
      whereCondition.OR = [
        {
          startTime: { lt: dto.endTime },
          endTime: { gt: dto.startTime },
        },
      ];
    }

    const existingAppointments = await this.prisma.appointment.findMany({
      where: whereCondition,
    });

    if (existingAppointments.length > 0) {
      throw new ConflictException(
        'Cannot set time off: there are booked appointments in this time range',
      );
    }

    return this.prisma.timeOff.create({
      data: {
        doctorId,
        date: dateObj,
        startTime: dto.startTime || null,
        endTime: dto.endTime || null,
        reason: dto.reason || null,
      },
    });
  }

  async deleteTimeOff(doctorId: string, timeOffId: string) {
    const timeOff = await this.prisma.timeOff.findFirst({
      where: { id: timeOffId, doctorId },
    });
    if (!timeOff) throw new NotFoundException('Time off not found');
    return this.prisma.timeOff.delete({ where: { id: timeOffId } });
  }

  // ─── Settings (price, avgServiceMin) ────────────────

  async getSettings(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { id: true, price: true, avgServiceMin: true },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async updateSettings(
    doctorId: string,
    data: { price?: number; avgServiceMin?: number },
  ) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return this.prisma.doctor.update({
      where: { id: doctorId },
      data,
      select: { id: true, price: true, avgServiceMin: true },
    });
  }

  // ─── Available Slots (for doctor panel) ─────────────

  async getAvailableSlots(doctorId: string, date: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { schedules: true },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    const schedule = doctor.schedules.find((s) => s.dayOfWeek === dayOfWeek);
    if (!schedule) return [];

    const timeOffs = await this.prisma.timeOff.findMany({
      where: { doctorId, date: dateObj },
    });

    const fullDayOff = timeOffs.find((t) => !t.startTime && !t.endTime);
    if (fullDayOff) return [];

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        date: dateObj,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });

    const slots: { startTime: string; endTime: string; available: boolean }[] = [];
    const avgMin = doctor.avgServiceMin || 30;

    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes + avgMin <= endMinutes) {
      const slotStart = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
      const slotEndMin = currentMinutes + avgMin;
      const slotEnd = `${String(Math.floor(slotEndMin / 60)).padStart(2, '0')}:${String(slotEndMin % 60).padStart(2, '0')}`;

      const isTimeOff = timeOffs.some((t) => {
        if (!t.startTime || !t.endTime) return false;
        return slotStart < t.endTime && slotEnd > t.startTime;
      });

      const isBooked = appointments.some(
        (a) => slotStart < a.endTime && slotEnd > a.startTime,
      );

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: !isTimeOff && !isBooked,
      });

      currentMinutes = slotEndMin;
    }

    return slots;
  }
}
