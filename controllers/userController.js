import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const createUserController = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "email and name are required" });
    }

    const user = await prisma.user.create({
      data: { name, email },
    });

    return res.status(200).json({
      sucess: true,
      message: "user created successfully",
    });
    console.log(user);
  } catch (error) {
    console.error("an error occured", error);
    throw error;
  }
};
