import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add a Business
const addBusiness = async (req, res) => {
  const { name, description, country, state, market } = req.body;
  const user = req.user;

  try {
    const business = await prisma.business.create({
      data: {
        name,
        description,
        country,
        state,
        market,
        Client: {
          connect: { id: user.id }, // Assuming the user is a Client
        },
      },
    });
    res
      .status(201)
      .json({ message: "Business created successfully", business });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Business", error: error.message });
  }
};

// Delete a Business by ID
const deleteBusiness = async (req, res) => {
  const { id } = req.params; // Assuming ID is passed as a route parameter

  try {
    // Check if the business exists
    const business = await prisma.business.findUnique({
      where: { id: Number(id) },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    await prisma.business.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Business deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Business", error: error.message });
  }
};

// Update a Business by ID
const updateBusiness = async (req, res) => {
  const { id } = req.params; // Assuming ID is passed as a route parameter
  const { name, description, country, state, market } = req.body;

  try {
    // Check if the business exists
    const business = await prisma.business.findUnique({
      where: { id: Number(id) },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        country,
        state,
        market,
      },
    });
    res
      .status(200)
      .json({
        message: "Business updated successfully",
        business: updatedBusiness,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Business", error: error.message });
  }
};

export { addBusiness, deleteBusiness, updateBusiness };
