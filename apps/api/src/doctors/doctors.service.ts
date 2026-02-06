import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByClinicAndSpecialty(clinicId: string, specialtyId: string) {
    return this.prisma.doctor.findMany({
      where: { clinicId, specialtyId },
      include: { reviews: true, specialty: true },
      orderBy: { firstName: 'asc' },
    });
  }

  async findById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: { clinic: true, reviews: true, schedules: true, specialty: true },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

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

    // Get time offs for this date
    const timeOffs = await this.prisma.timeOff.findMany({
      where: {
        doctorId,
        date: dateObj,
      },
    });

    // Full day off check
    const fullDayOff = timeOffs.find((t) => !t.startTime && !t.endTime);
    if (fullDayOff) return [];

    // Get existing appointments for this date
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        date: dateObj,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });

    // Generate slots based on avgServiceMin
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

      // Check if slot overlaps with time off
      const isTimeOff = timeOffs.some((t) => {
        if (!t.startTime || !t.endTime) return false;
        return slotStart < t.endTime && slotEnd > t.startTime;
      });

      // Check if slot overlaps with existing appointment
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
