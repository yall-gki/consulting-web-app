// controllers/userController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;

    // Validate userType
    if (!["Client", "Consultant"].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const pepperedPassword = process.env.PEPPER + password;
    const hashedPassword = await bcrypt.hash(pepperedPassword, 10);
    let user;
    switch (userType) {
      
      case "Client":
        user = await prisma.client.create({
          data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            userType
          },
        });
         
        break;
      case "Consultant":
        user = await prisma.consultant.create({
          data: firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
          

        break;
    }
      res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.client.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      process.env.PEPPER + password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true ,isSecureContext:true});

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
const loginConsultant = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.consultant.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      process.env.PEPPER + password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const logoutUser = (req, res) => {
  // Clear token cookie
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export { createUser, loginClient, loginConsultant, logoutUser };
