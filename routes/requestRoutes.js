import express from "express";
import {
  createRequest,
  getRequestById,
  updateRequest,
  deleteRequest,
} from "../controllers/requestController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createRequest);

router.get("/:id", getRequestById);

router.patch("/:id", updateRequest);

router.delete("/:id", deleteRequest);

export default router;
