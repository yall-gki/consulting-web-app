// app.js
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/mongoose.config.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import adRoutes from './routes/adRoutes.js';
import businessRoutes from "./routes/businessRoutes.js";
import consultantRoutes from "./routes/consultantRoutes.js";
import { authorizeConsultant } from './middleware/authMiddleware.js';



// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB()
// Initialize Express app
const app = express();
app.use(cookieParser())
// Middleware
app.use(morgan('dev')); // Logging HTTP requests
app.use(helmet()); // Security headers
app.use(cors()); // Cross-Origin Resource Sharing
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Handle Socket.IO connections

// Routes
app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes);
app.use("/api/consultant", authorizeConsultant, consultantRoutes);
app.use("/api/business", authorizeConsultant, businessRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

