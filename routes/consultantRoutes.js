// routes/userRoutes.js
import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";
import {authenticate} from "../middleware/authMiddleware.js";
import getClientInterractions from "../controllers/consultantController.js"
const router = express.Router();

router.post("/interraction");
router.get("/interractions", getClientInterractions);
router.post("/", logoutUser);
router.get("/user/info");

export default router;
