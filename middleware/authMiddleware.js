import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    // Extract token from cookie
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id using Prisma
    const user = await prisma.client.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set user on request object
    req.user = user;

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

const authorizeConsultant = (req, res, next) => {
  try {
    // Check if the user is a CONSULTANT
    if (req.user.userType !== "Consultant") {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: You don't have permission to access this resource",
        });
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json({
        message: "Unauthorized: User type check failed",
        error: error.message,
      });
  }
};

const authorizeClient = (req, res, next) => {
  try {
    
    // Check if the user is a CONSULTANT
    if (req.user.userType !== "Client") {
      return res.status(403).json(req.user.userType, {
        message: "Forbidden: You don't have permission to access this resource",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      type : req.user,
      message: "Unauthorized: User type check failed",
      error: error.message,
    });
  }
};
export { authorizeConsultant, authenticate, authorizeClient };
