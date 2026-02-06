import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ClinicsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByRegion(regionId: string) {
    return this.prisma.clinic.findMany({
      where: { regionId },
      include: { region: true },
      orderBy: { nameUz: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.clinic.findUnique({
      where: { id },
      include: { region: true, doctors: true },
    });
  }

  async getSpecialties(clinicId: string) {
    const doctors = await this.prisma.doctor.findMany({
      where: { clinicId },
      select: { specialty: true },
      distinct: ['specialtyId'],
    });
    return doctors.map(d => d.specialty);
  }
}
