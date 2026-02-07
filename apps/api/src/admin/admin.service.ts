import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Regions ────────────────────────────────────────

  async createRegion(dto: CreateRegionDto) {
    return this.prisma.region.create({ data: dto });
  }

  async findAllRegions() {
    return this.prisma.region.findMany({ orderBy: { nameUz: 'asc' } });
  }

  async findRegionById(id: string) {
    const region = await this.prisma.region.findUnique({ where: { id } });
    if (!region) throw new NotFoundException('Region not found');
    return region;
  }

  async updateRegion(id: string, dto: UpdateRegionDto) {
    await this.findRegionById(id);
    return this.prisma.region.update({ where: { id }, data: dto });
  }

  async deleteRegion(id: string) {
    await this.findRegionById(id);
    const clinicsCount = await this.prisma.clinic.count({ where: { regionId: id } });
    if (clinicsCount > 0) {
      throw new BadRequestException(
        `Bu hududda ${clinicsCount} ta klinika bor. Avval klinikalarni o'chiring yoki boshqa hududga ko'chiring.`,
      );
    }
    const usersCount = await this.prisma.user.count({ where: { regionId: id } });
    if (usersCount > 0) {
      throw new BadRequestException(
        `Bu hududda ${usersCount} ta foydalanuvchi bor. Avval foydalanuvchilarni boshqa hududga ko'chiring.`,
      );
    }
    return this.prisma.region.delete({ where: { id } });
  }

  // ─── Clinics ────────────────────────────────────────

  async createClinic(dto: CreateClinicDto) {
    await this.findRegionById(dto.regionId);
    return this.prisma.clinic.create({
      data: dto,
      include: { region: true },
    });
  }

  async findAllClinics() {
    const clinics = await this.prisma.clinic.findMany({
      include: {
        region: true,
        owner: true,
        _count: { select: { doctors: true } },
      },
      orderBy: { nameUz: 'asc' },
    });

    // Attach unique patient count per clinic
    const result = await Promise.all(
      clinics.map(async (c) => {
        const patients = await this.prisma.appointment.findMany({
          where: { doctor: { clinicId: c.id } },
          select: { userId: true },
          distinct: ['userId'],
        });
        return { ...c, _patientCount: patients.length };
      }),
    );
    return result;
  }

  async findClinicById(id: string) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id },
      include: { region: true, owner: true, doctors: true },
    });
    if (!clinic) throw new NotFoundException('Clinic not found');
    return clinic;
  }

  async findClinicsByRegion(regionId: string) {
    return this.prisma.clinic.findMany({
      where: { regionId },
      include: { region: true },
      orderBy: { nameUz: 'asc' },
    });
  }

  async updateClinic(id: string, dto: UpdateClinicDto) {
    await this.findClinicById(id);
    return this.prisma.clinic.update({
      where: { id },
      data: dto,
      include: { region: true },
    });
  }

  async deleteClinic(id: string) {
    await this.findClinicById(id);
    const doctorsCount = await this.prisma.doctor.count({ where: { clinicId: id } });
    if (doctorsCount > 0) {
      throw new BadRequestException(
        `Bu klinikada ${doctorsCount} ta shifokor bor. Avval shifokorlarni o'chiring.`,
      );
    }
    const owner = await this.prisma.clinicOwner.findUnique({ where: { clinicId: id } });
    if (owner) {
      throw new BadRequestException(
        `Bu klinikada egasi bor. Avval egani o'chiring.`,
      );
    }
    return this.prisma.clinic.delete({ where: { id } });
  }

  // ─── Clinic Owners ─────────────────────────────────

  async createOwner(dto: CreateOwnerDto) {
    const clinic = await this.findClinicById(dto.clinicId);
    if (clinic.owner) {
      throw new ConflictException('This clinic already has an owner');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.clinicOwner.create({
      data: { ...dto, password: hashedPassword },
      include: { clinic: true },
    });
  }

  async findAllOwners() {
    return this.prisma.clinicOwner.findMany({
      include: { clinic: true },
    });
  }

  async findOwnerById(id: string) {
    const owner = await this.prisma.clinicOwner.findUnique({
      where: { id },
      include: { clinic: true },
    });
    if (!owner) throw new NotFoundException('Owner not found');
    return owner;
  }

  async updateOwner(id: string, dto: UpdateOwnerDto) {
    await this.findOwnerById(id);
    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    return this.prisma.clinicOwner.update({
      where: { id },
      data,
      include: { clinic: true },
    });
  }

  async deleteOwner(id: string) {
    await this.findOwnerById(id);
    return this.prisma.clinicOwner.delete({ where: { id } });
  }

  // ─── Specialties (Founder only) ─────────────────────

  async createSpecialty(dto: CreateSpecialtyDto) {
    return this.prisma.specialty.create({ data: dto });
  }

  async findAllSpecialties() {
    return this.prisma.specialty.findMany({ orderBy: { nameUz: 'asc' } });
  }

  async findSpecialtyById(id: string) {
    const specialty = await this.prisma.specialty.findUnique({ where: { id } });
    if (!specialty) throw new NotFoundException('Specialty not found');
    return specialty;
  }

  async updateSpecialty(id: string, dto: UpdateSpecialtyDto) {
    await this.findSpecialtyById(id);
    return this.prisma.specialty.update({ where: { id }, data: dto });
  }

  async deleteSpecialty(id: string) {
    await this.findSpecialtyById(id);
    const doctorsCount = await this.prisma.doctor.count({ where: { specialtyId: id } });
    if (doctorsCount > 0) {
      throw new BadRequestException(
        `Bu mutaxassislikda ${doctorsCount} ta shifokor bor. Avval shifokorlarni o'chiring yoki boshqa mutaxassislikka ko'chiring.`,
      );
    }
    return this.prisma.specialty.delete({ where: { id } });
  }

  // ─── Doctors (Clinic Owner manages) ─────────────────

  async createDoctor(dto: CreateDoctorDto) {
    await this.findClinicById(dto.clinicId);
    await this.findSpecialtyById(dto.specialtyId);
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.doctor.create({
      data: { ...dto, password: hashedPassword },
      include: { clinic: true, specialty: true },
    });
  }

  async findDoctorsByClinic(clinicId: string) {
    return this.prisma.doctor.findMany({
      where: { clinicId },
      include: { clinic: true, specialty: true },
      orderBy: { firstName: 'asc' },
    });
  }

  async findAllDoctors() {
    return this.prisma.doctor.findMany({
      include: { clinic: true, specialty: true },
      orderBy: { firstName: 'asc' },
    });
  }

  async findDoctorById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: { clinic: true, specialty: true, reviews: true },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async updateDoctor(id: string, dto: UpdateDoctorDto) {
    await this.findDoctorById(id);
    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    return this.prisma.doctor.update({
      where: { id },
      data,
      include: { clinic: true, specialty: true },
    });
  }

  async deleteDoctor(id: string) {
    await this.findDoctorById(id);
    const appointmentsCount = await this.prisma.appointment.count({ where: { doctorId: id } });
    if (appointmentsCount > 0) {
      throw new BadRequestException(
        `Bu shifokorning ${appointmentsCount} ta qabuli bor. Avval qabullarni o'chiring.`,
      );
    }
    // Cascade delete schedules and timeoffs
    await this.prisma.schedule.deleteMany({ where: { doctorId: id } });
    await this.prisma.timeOff.deleteMany({ where: { doctorId: id } });
    await this.prisma.review.deleteMany({ where: { doctorId: id } });
    return this.prisma.doctor.delete({ where: { id } });
  }

  // ─── Auth (Founder & Clinic Owner login) ────────────

  async loginFounder(phone: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { phone } });
    if (!admin) throw new NotFoundException('Admin not found');
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new ConflictException('Invalid credentials');
    return { id: admin.id, phone: admin.phone, role: admin.role };
  }

  async loginOwner(phone: string, password: string) {
    const owner = await this.prisma.clinicOwner.findUnique({
      where: { phone },
      include: { clinic: true },
    });
    if (!owner) throw new NotFoundException('Owner not found');
    const valid = await bcrypt.compare(password, owner.password);
    if (!valid) throw new ConflictException('Invalid credentials');
    return { id: owner.id, phone: owner.phone, clinicId: owner.clinicId, clinic: owner.clinic };
  }

  // ─── Clinic Stats (Owner Dashboard) ─────────────────

  async getClinicStats(clinicId: string) {
    const doctors = await this.prisma.doctor.findMany({
      where: { clinicId },
      include: { specialty: true, schedules: true },
    });

    const appointments = await this.prisma.appointment.findMany({
      where: { doctor: { clinicId } },
      include: { user: true, diagnosis: true, doctor: { include: { specialty: true } } },
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
    });

    const totalDoctors = doctors.length;
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
    const pendingAppointments = appointments.filter(a => a.status === 'PENDING').length;
    const acceptedAppointments = appointments.filter(a => a.status === 'ACCEPTED').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED').length;

    // Revenue = finalPrice if set, otherwise doctor default price
    const totalRevenue = appointments
      .filter(a => a.status === 'COMPLETED')
      .reduce((sum, a) => sum + (a.finalPrice ?? a.doctor?.price ?? 0), 0);

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todayAppointments = appointments.filter(a => {
      const d = new Date(a.date);
      return d >= today && d <= todayEnd;
    });

    const todayRevenue = todayAppointments
      .filter(a => a.status === 'COMPLETED')
      .reduce((sum, a) => sum + (a.finalPrice ?? a.doctor?.price ?? 0), 0);

    return {
      totalDoctors,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      acceptedAppointments,
      cancelledAppointments,
      totalRevenue,
      todayAppointments: todayAppointments.length,
      todayRevenue,
      doctors,
      appointments,
    };
  }

  // ─── All Users (Founder) ────────────────────────────

  async findAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Clinic Patients (Owner) ────────────────────────

  async getClinicPatients(clinicId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctor: { clinicId } },
      include: {
        user: true,
        doctor: { include: { specialty: true } },
        diagnosis: true,
      },
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
    });

    // Group by user
    const userMap = new Map<string, any>();
    for (const a of appointments) {
      if (!a.user || !a.userId) continue;
      const uid = a.userId as string;
      if (!userMap.has(uid)) {
        userMap.set(uid, {
          ...a.user,
          appointments: [],
          totalVisits: 0,
          completedVisits: 0,
        });
      }
      const u = userMap.get(uid);
      u.appointments.push(a);
      u.totalVisits++;
      if (a.status === 'COMPLETED') u.completedVisits++;
    }

    return Array.from(userMap.values());
  }
}
