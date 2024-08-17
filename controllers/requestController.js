import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a Request
export const createRequest = async (req, res) => {
  const { consultantId, duration } = req.body;
  const clientId = req.user.id;

  try {
    const request = await prisma.request.create({
      data: {
        clientId,
        consultantId,
        duration,
        status: "pending", // Assuming there's a status field, not defined in schema
      },
    });
    res.status(201).json({
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Request", error: error.message });
  }
};

// Get a Request by ID
export const getRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await prisma.request.findUnique({
      where: { id: Number(id) },
      include: {
        client: true,
        consultant: true,
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Request", error: error.message });
  }
};

// Update a Request by ID
export const updateRequest = async (req, res) => {
  const { id } = req.params;
  const { status, duration } = req.body;

  try {
    const request = await prisma.request.update({
      where: { id: Number(id) },
      data: {
        status,
        duration,
      },
    });

    res.status(200).json({
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Request", error: error.message });
  }
};

// Delete a Request by ID
export const deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.request.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Request deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Request", error: error.message });
  }
};
