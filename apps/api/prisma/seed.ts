import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data (in correct order to respect foreign keys)
  await prisma.diagnosis.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.timeOff.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.review.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.clinicOwner.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.specialty.deleteMany();
  await prisma.user.deleteMany();
  await prisma.region.deleteMany();
  await prisma.admin.deleteMany();
  console.log('🧹 Old data cleaned');

  // Create Founder Admin
  const founderPassword = await bcrypt.hash('founder123', 10);
  await prisma.admin.upsert({
    where: { phone: '+998900000001' },
    update: {},
    create: {
      phone: '+998900000001',
      password: founderPassword,
      role: 'FOUNDER',
    },
  });
  console.log('✅ Founder admin created: +998900000001 / founder123');

  // Create Regions
  const tashkent = await prisma.region.create({
    data: { nameUz: 'Toshkent', nameRu: 'Ташкент' },
  });
  const samarkand = await prisma.region.create({
    data: { nameUz: 'Samarqand', nameRu: 'Самарканд' },
  });
  const bukhara = await prisma.region.create({
    data: { nameUz: 'Buxoro', nameRu: 'Бухара' },
  });
  console.log('✅ Regions created');

  // Create Specialties
  const stomatolog = await prisma.specialty.create({
    data: { nameUz: 'Stomatolog', nameRu: 'Стоматолог' },
  });
  const pediatr = await prisma.specialty.create({
    data: { nameUz: 'Pediatr', nameRu: 'Педиатр' },
  });
  const terapevt = await prisma.specialty.create({
    data: { nameUz: 'Terapevt', nameRu: 'Терапевт' },
  });
  const kardiolog = await prisma.specialty.create({
    data: { nameUz: 'Kardiolog', nameRu: 'Кардиолог' },
  });
  const nevrolog = await prisma.specialty.create({
    data: { nameUz: 'Nevrolog', nameRu: 'Невролог' },
  });
  console.log('✅ Specialties created');

  // Create Clinics
  const clinic1 = await prisma.clinic.create({
    data: {
      nameUz: 'MedLine Clinic',
      nameRu: 'Клиника МедЛайн',
      address: 'Toshkent sh., Chilonzor tumani',
      phone: '+998712345678',
      regionId: tashkent.id,
    },
  });
  const clinic2 = await prisma.clinic.create({
    data: {
      nameUz: 'Hayot Med',
      nameRu: 'Хаёт Мед',
      address: 'Toshkent sh., Yunusobod tumani',
      phone: '+998712345679',
      regionId: tashkent.id,
    },
  });
  const clinic3 = await prisma.clinic.create({
    data: {
      nameUz: 'Shifo Clinic',
      nameRu: 'Клиника Шифо',
      address: 'Samarqand sh., markaz',
      phone: '+998662345678',
      regionId: samarkand.id,
    },
  });
  console.log('✅ Clinics created');

  // Create Clinic Owners
  const ownerPassword = await bcrypt.hash('owner123', 10);
  await prisma.clinicOwner.create({
    data: {
      phone: '+998900000010',
      password: ownerPassword,
      clinicId: clinic1.id,
    },
  });
  await prisma.clinicOwner.create({
    data: {
      phone: '+998900000011',
      password: ownerPassword,
      clinicId: clinic2.id,
    },
  });
  console.log('✅ Clinic owners created: +998900000010 / owner123');

  // Create Doctors
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const doctor1 = await prisma.doctor.create({
    data: {
      firstName: 'Alisher',
      lastName: 'Karimov',
      phone: '+998900000100',
      password: doctorPassword,
      specialtyId: stomatolog.id,
      experienceYears: 10,
      price: 150000,
      avgServiceMin: 30,
      room: '101',
      clinicId: clinic1.id,
    },
  });
  const doctor2 = await prisma.doctor.create({
    data: {
      firstName: 'Nodira',
      lastName: 'Azimova',
      phone: '+998900000101',
      password: doctorPassword,
      specialtyId: pediatr.id,
      experienceYears: 7,
      price: 100000,
      avgServiceMin: 40,
      room: '205',
      clinicId: clinic1.id,
    },
  });
  const doctor3 = await prisma.doctor.create({
    data: {
      firstName: 'Bobur',
      lastName: 'Rahimov',
      phone: '+998900000102',
      password: doctorPassword,
      specialtyId: terapevt.id,
      experienceYears: 15,
      price: 120000,
      avgServiceMin: 30,
      room: '312',
      clinicId: clinic2.id,
    },
  });
  const doctor4 = await prisma.doctor.create({
    data: {
      firstName: 'Kamola',
      lastName: 'Tosheva',
      phone: '+998900000103',
      password: doctorPassword,
      specialtyId: kardiolog.id,
      experienceYears: 12,
      price: 200000,
      avgServiceMin: 45,
      room: '118',
      clinicId: clinic3.id,
    },
  });
  console.log('✅ Doctors created: +998900000100 / doctor123');

  // Create Schedules (Mon-Fri 09:00-18:00, Sat 09:00-14:00)
  for (const doctor of [doctor1, doctor2, doctor3, doctor4]) {
    for (let day = 1; day <= 5; day++) {
      await prisma.schedule.create({
        data: {
          doctorId: doctor.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
        },
      });
    }
    await prisma.schedule.create({
      data: {
        doctorId: doctor.id,
        dayOfWeek: 6, // Saturday
        startTime: '09:00',
        endTime: '14:00',
      },
    });
  }
  console.log('✅ Schedules created');

  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      phone: '+998901111111',
      firstName: 'Test',
      lastName: 'User',
      language: 'UZ',
      regionId: tashkent.id,
    },
  });
  const testUser2 = await prisma.user.create({
    data: {
      phone: '+998901111112',
      firstName: 'Aziza',
      lastName: 'Nurmatova',
      language: 'UZ',
      regionId: tashkent.id,
    },
  });
  const testUser3 = await prisma.user.create({
    data: {
      phone: '+998901111113',
      firstName: 'Jasur',
      lastName: 'Toshmatov',
      language: 'UZ',
      regionId: samarkand.id,
    },
  });
  console.log('✅ Test users created');

  // Create sample appointments for clinic1 (MedLine)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  await prisma.appointment.createMany({
    data: [
      // Doctor1 (Alisher, Stomatolog) — clinic1
      {
        userId: testUser.id,
        doctorId: doctor1.id,
        date: today,
        startTime: '09:00',
        endTime: '09:30',
        status: 'COMPLETED',
      },
      {
        userId: testUser2.id,
        doctorId: doctor1.id,
        date: today,
        startTime: '10:00',
        endTime: '10:30',
        status: 'ACCEPTED',
      },
      {
        userId: testUser3.id,
        doctorId: doctor1.id,
        date: tomorrow,
        startTime: '11:00',
        endTime: '11:30',
        status: 'PENDING',
      },
      // Doctor2 (Nodira, Pediatr) — clinic1
      {
        userId: testUser2.id,
        doctorId: doctor2.id,
        date: yesterday,
        startTime: '14:00',
        endTime: '14:40',
        status: 'COMPLETED',
      },
      {
        userId: testUser.id,
        doctorId: doctor2.id,
        date: today,
        startTime: '09:00',
        endTime: '09:40',
        status: 'PENDING',
      },
      {
        userId: testUser3.id,
        doctorId: doctor2.id,
        date: tomorrow,
        startTime: '10:00',
        endTime: '10:40',
        status: 'PENDING',
      },
      // Doctor3 (Bobur, Terapevt) — clinic2
      {
        userId: testUser.id,
        doctorId: doctor3.id,
        date: today,
        startTime: '09:00',
        endTime: '09:30',
        status: 'ACCEPTED',
      },
      {
        userId: testUser2.id,
        doctorId: doctor3.id,
        date: yesterday,
        startTime: '15:00',
        endTime: '15:30',
        status: 'COMPLETED',
      },
    ],
  });
  console.log('✅ Sample appointments created');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
