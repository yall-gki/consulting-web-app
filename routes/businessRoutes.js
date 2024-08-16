// routes/businessRoutes.js
import express from "express";
import {
  addBusiness,
  deleteBusiness,
  updateBusiness,
} from "../controllers/businessController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to ensure user is authenticated
router.use(authenticate);

// Routes for business operations
router.post("/add", addBusiness); // Route to add a new business
router.delete("/:id", deleteBusiness); // Route to delete a business by ID
router.put("/:id", updateBusiness); // Route to update a business by ID

export default router;
