// __tests__/userController.test.js
const request = require("supertest");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRoutes = require("../../routes/userRoutes.js"); // Use CommonJS import

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes); // Adjust base route if needed

jest.mock("@prisma/client");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Login Routes", () => {
  let prismaMock;

  beforeAll(() => {
    prismaMock = new PrismaClient();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should log in a client successfully", async () => {
    const client = {
      id: 1,
      email: "client@example.com",
      password: "hashedPassword",
    };

    prismaMock.client.findUnique.mockResolvedValue(client);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fakeJwtToken");

    const res = await request(app)
      .post("/api/users/login/client")
      .send({ email: "client@example.com", password: "clientPassword" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.user).toHaveProperty("email", "client@example.com");
  });

  it("should return 404 if client is not found", async () => {
    prismaMock.client.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/users/login/client")
      .send({ email: "nonexistent@example.com", password: "password" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 401 if password is incorrect", async () => {
    const client = {
      id: 1,
      email: "client@example.com",
      password: "hashedPassword",
    };

    prismaMock.client.findUnique.mockResolvedValue(client);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/users/login/client")
      .send({ email: "client@example.com", password: "wrongPassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid password");
  });

  // Similar tests can be written for consultant login
});
