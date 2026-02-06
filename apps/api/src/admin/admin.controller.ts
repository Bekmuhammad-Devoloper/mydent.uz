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
import { AdminService } from './admin.service';
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

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Auth ───────────────────────────────────────────

  @Post('login/founder')
  @ApiOperation({ summary: 'Founder login' })
  loginFounder(@Body() body: { phone: string; password: string }) {
    return this.adminService.loginFounder(body.phone, body.password);
  }

  @Post('login/owner')
  @ApiOperation({ summary: 'Clinic Owner login' })
  loginOwner(@Body() body: { phone: string; password: string }) {
    return this.adminService.loginOwner(body.phone, body.password);
  }

  // ─── Regions ────────────────────────────────────────

  @Post('regions')
  @ApiOperation({ summary: 'Create region (Founder)' })
  createRegion(@Body() dto: CreateRegionDto) {
    return this.adminService.createRegion(dto);
  }

  @Get('regions')
  @ApiOperation({ summary: 'List all regions' })
  findAllRegions() {
    return this.adminService.findAllRegions();
  }

  @Get('regions/:id')
  @ApiOperation({ summary: 'Get region by ID' })
  findRegionById(@Param('id') id: string) {
    return this.adminService.findRegionById(id);
  }

  @Put('regions/:id')
  @ApiOperation({ summary: 'Update region (Founder)' })
  updateRegion(@Param('id') id: string, @Body() dto: UpdateRegionDto) {
    return this.adminService.updateRegion(id, dto);
  }

  @Delete('regions/:id')
  @ApiOperation({ summary: 'Delete region (Founder)' })
  deleteRegion(@Param('id') id: string) {
    return this.adminService.deleteRegion(id);
  }

  // ─── Clinics ────────────────────────────────────────

  @Post('clinics')
  @ApiOperation({ summary: 'Create clinic (Founder)' })
  createClinic(@Body() dto: CreateClinicDto) {
    return this.adminService.createClinic(dto);
  }

  @Get('clinics')
  @ApiOperation({ summary: 'List all clinics' })
  findAllClinics() {
    return this.adminService.findAllClinics();
  }

  @Get('clinics/by-region/:regionId')
  @ApiOperation({ summary: 'List clinics by region' })
  findClinicsByRegion(@Param('regionId') regionId: string) {
    return this.adminService.findClinicsByRegion(regionId);
  }

  @Get('clinics/:id')
  @ApiOperation({ summary: 'Get clinic by ID' })
  findClinicById(@Param('id') id: string) {
    return this.adminService.findClinicById(id);
  }

  @Put('clinics/:id')
  @ApiOperation({ summary: 'Update clinic (Founder)' })
  updateClinic(@Param('id') id: string, @Body() dto: UpdateClinicDto) {
    return this.adminService.updateClinic(id, dto);
  }

  @Delete('clinics/:id')
  @ApiOperation({ summary: 'Delete clinic (Founder)' })
  deleteClinic(@Param('id') id: string) {
    return this.adminService.deleteClinic(id);
  }

  // ─── Owners ─────────────────────────────────────────

  @Post('owners')
  @ApiOperation({ summary: 'Create clinic owner (Founder)' })
  createOwner(@Body() dto: CreateOwnerDto) {
    return this.adminService.createOwner(dto);
  }

  @Get('owners')
  @ApiOperation({ summary: 'List all clinic owners' })
  findAllOwners() {
    return this.adminService.findAllOwners();
  }

  @Get('owners/:id')
  @ApiOperation({ summary: 'Get clinic owner by ID' })
  findOwnerById(@Param('id') id: string) {
    return this.adminService.findOwnerById(id);
  }

  @Put('owners/:id')
  @ApiOperation({ summary: 'Update clinic owner (Founder)' })
  updateOwner(@Param('id') id: string, @Body() dto: UpdateOwnerDto) {
    return this.adminService.updateOwner(id, dto);
  }

  @Delete('owners/:id')
  @ApiOperation({ summary: 'Delete clinic owner (Founder)' })
  deleteOwner(@Param('id') id: string) {
    return this.adminService.deleteOwner(id);
  }

  // ─── Specialties (Founder) ──────────────────────────

  @Post('specialties')
  @ApiOperation({ summary: 'Create specialty (Founder)' })
  createSpecialty(@Body() dto: CreateSpecialtyDto) {
    return this.adminService.createSpecialty(dto);
  }

  @Get('specialties')
  @ApiOperation({ summary: 'List all specialties' })
  findAllSpecialties() {
    return this.adminService.findAllSpecialties();
  }

  @Get('specialties/:id')
  @ApiOperation({ summary: 'Get specialty by ID' })
  findSpecialtyById(@Param('id') id: string) {
    return this.adminService.findSpecialtyById(id);
  }

  @Put('specialties/:id')
  @ApiOperation({ summary: 'Update specialty (Founder)' })
  updateSpecialty(@Param('id') id: string, @Body() dto: UpdateSpecialtyDto) {
    return this.adminService.updateSpecialty(id, dto);
  }

  @Delete('specialties/:id')
  @ApiOperation({ summary: 'Delete specialty (Founder)' })
  deleteSpecialty(@Param('id') id: string) {
    return this.adminService.deleteSpecialty(id);
  }

  // ─── Doctors (Clinic Owner manages) ─────────────────

  @Post('doctors')
  @ApiOperation({ summary: 'Create doctor (Owner/Founder)' })
  createDoctor(@Body() dto: CreateDoctorDto) {
    return this.adminService.createDoctor(dto);
  }

  @Get('doctors/by-clinic/:clinicId')
  @ApiOperation({ summary: 'List doctors by clinic' })
  findDoctorsByClinic(@Param('clinicId') clinicId: string) {
    return this.adminService.findDoctorsByClinic(clinicId);
  }

  @Get('doctors')
  @ApiOperation({ summary: 'List all doctors' })
  findAllDoctors() {
    return this.adminService.findAllDoctors();
  }

  @Get('doctors/:id')
  @ApiOperation({ summary: 'Get doctor by ID' })
  findDoctorById(@Param('id') id: string) {
    return this.adminService.findDoctorById(id);
  }

  @Put('doctors/:id')
  @ApiOperation({ summary: 'Update doctor' })
  updateDoctor(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.adminService.updateDoctor(id, dto);
  }

  @Delete('doctors/:id')
  @ApiOperation({ summary: 'Delete doctor' })
  deleteDoctor(@Param('id') id: string) {
    return this.adminService.deleteDoctor(id);
  }

  // ─── Clinic Stats (Owner Dashboard) ─────────────────

  @Get('clinic-stats/:clinicId')
  @ApiOperation({ summary: 'Get clinic stats for owner dashboard' })
  getClinicStats(@Param('clinicId') clinicId: string) {
    return this.adminService.getClinicStats(clinicId);
  }
}
