import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, gender, role } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        role,
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        patientProfile: true,
        doctorProfile: true,
        adminProfile: true,
        kyc: true,
        userConsent: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ SINGLE USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        patientProfile: true,
        doctorProfile: true,
        adminProfile: true,
        appointments: true,
        payments: true,
        kyc: true,
        userConsent: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, gender, avatarUrl } = req.body;

    const updatedUser = await prisma.users.update({
      where: { id },
      data: { firstName, lastName, gender, avatarUrl },
    });

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
