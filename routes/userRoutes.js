// routes/userRoutes.js
import express from 'express';
import {
  createUser,
  loginConsultant,
  loginClient,
  logoutUser,
} from "../controllers/userController.js";
import {authenticate} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', createUser);
router.post("/login/consultant", loginConsultant);
router.post("/login/client", loginClient);
router.post('/logout', logoutUser);
router.get('/user/info', authenticate);

export default router;
