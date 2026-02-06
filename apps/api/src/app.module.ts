import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { ClinicsModule } from './clinics/clinics.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DoctorPanelModule } from './doctor-panel/doctor-panel.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    CommonModule,
    HealthModule,
    AdminModule,
    UsersModule,
    ClinicsModule,
    DoctorsModule,
    AppointmentsModule,
    DoctorPanelModule,
    BotModule,
  ],
})
export class AppModule {}
