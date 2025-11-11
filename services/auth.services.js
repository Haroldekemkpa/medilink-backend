import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js"; // adjust your prisma path
import { cacheSet, cacheGet } from "../utils/cache.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Authenticate user and return a JWT token
 */
export async function loginUser(email, password) {
  // Check cache first
  const cachedUser = await cacheGet(`user:${email}`);
  let user;

  if (cachedUser) {
    user = JSON.parse(cachedUser);
  } else {
    user = await prisma.users.findUnique({
      where: { email },
      include: {
        doctorProfile: true,
        patientProfile: true,
      },
    });

    if (!user) throw new Error("User not found");

    // Cache user for 1 hour
    await cacheSet(`user:${email}`, JSON.stringify(user), 3600);
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  return { token, user };
}

/**
 * Decode JWT and get user info
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
