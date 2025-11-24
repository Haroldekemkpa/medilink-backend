import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Passwords ---
  const patientPassword = await bcrypt.hash("patient123", 10);
  const doctorPassword = await bcrypt.hash("doctor123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  // ----------- PATIENT -----------
  const patientUser = await prisma.users.create({
    data: {
      firstName: "Harold",
      lastName: "Ekemkpa",
      email: "harold@example.com",
      password: patientPassword,
      role: "PATIENT",
      dateOfBirth: new Date("1999-07-04"),
      gender: "MALE",
      avatarUrl: "https://randomuser.me/api/portraits/men/10.jpg",
    },
  });

  await prisma.patient.create({
    data: {
      userId: patientUser.id,
      age: 26,
      gender: "MALE",
      bloodType: "O+",
    },
  });

  await prisma.userConsent.create({
    data: {
      userId: patientUser.id,
      tandC: true,
      privacy: true,
      marketingOptin: false,
      telemedConsent: true,
    },
  });

  // ----------- DOCTOR -----------
  const doctorUser = await prisma.users.create({
    data: {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@hospital.com",
      password: doctorPassword,
      role: "DOCTOR",
      dateOfBirth: new Date("1985-05-12"),
      gender: "FEMALE",
      avatarUrl: "https://randomuser.me/api/portraits/women/5.jpg",
    },
  });

  await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      firstName: "Jane",
      lastName: "Doe",
      title: "Dr",
      email: "jane.doe@hospital.com",
      phone: "+2348012345678",
      password: doctorPassword,
      specialization: "Cardiology",
      licenceNumber: "DOC12345",
      yearsOfExp: 12,
      hospital: "Rivers State General Hospital",
      avatarUrl: "https://randomuser.me/api/portraits/women/5.jpg",
      verificationStatus: "APPROVED",
    },
  });

  // ----------- ADMIN -----------
  const adminUser = await prisma.users.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@medilink.com",
      password: adminPassword,
      role: "ADMIN",
      dateOfBirth: new Date("1990-01-01"),
      gender: "PREFER_NOT_TO_SAY",
      avatarUrl: "https://randomuser.me/api/portraits/lego/1.jpg",
    },
  });

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      position: "Super Admin",
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
