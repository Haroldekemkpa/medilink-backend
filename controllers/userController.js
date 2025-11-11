import { PrismaClient } from "@prisma/client";
// ✅ correct relative path for ESM
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

    console.log(user);

    return res.status(200).json({
      success: true,
      message: "user created successfully",
      data: user,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
