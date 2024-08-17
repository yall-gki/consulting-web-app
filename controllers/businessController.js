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
  const { id } = req.params; // Business ID from the route
  const userId = req.user.id; // ID from the authenticated user

  try {
    // Check if the business exists
    const business = await prisma.business.findUnique({
      where: { id: Number(id) },
      include: { Client: true }, // Include the related Client information
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Check if the authenticated user is the owner of the business
    const isOwner = business.Client.some((client) => client.id === userId);

    if (!isOwner) {
      return res.status(403).json({
        message:
          "Forbidden: You do not have permission to delete this business",
      });
    }

    // Proceed with deletion if ownership is confirmed
    await prisma.business.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Business deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting business", error: error.message });
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
