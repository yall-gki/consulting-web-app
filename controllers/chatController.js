import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

const prisma = new PrismaClient();

// Initialize Socket.IO server (assuming Express is used)
const io = new Server();

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Create or retrieve a Chat
export const createOrGetChat = async (req, res) => {
  const { user } = req; // Get authenticated user
  const { id } = user; // The ID of the authenticated user
  const { recipientId } = req.body; // ID of the other user (client or consultant)

  try {
    let clientId, consultantId;

    // Determine who is making the request
    if (user.role === "client") {
      clientId = id;
      consultantId = recipientId;
    } else if (user.role === "consultant") {
      consultantId = id;
      clientId = recipientId;
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    // Check if a chat already exists between these two users
    let chat = await prisma.chat.findFirst({
      where: {
        clientId,
        consultantId,
      },
      include: {
        messages: true,
      },
    });

    if (!chat) {
      // If no chat exists, create one
      chat = await prisma.chat.create({
        data: {
          clientId,
          consultantId,
        },
        include: {
          messages: true,
        },
      });
    }

    res.status(200).json({ chat });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error creating or retrieving chat",
        error: error.message,
      });
  }
};

// Send a message in a chat
export const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;
  const { id: userId } = req.user;

  try {
    // Check if the chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Ensure the user is part of the chat
    if (chat.clientId !== userId && chat.consultantId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this chat" });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        chatId: chat.id,
      },
    });

    // Emit the message to both users in the chat via Socket.IO
    io.to(chat.clientId).emit("message", message);
    io.to(chat.consultantId).emit("message", message);

    res.status(201).json({ message: "Message sent", message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

// Get all messages in a chat
export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Fetch the chat and include all messages
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
      include: {
        messages: true,
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving messages", error: error.message });
  }
};
