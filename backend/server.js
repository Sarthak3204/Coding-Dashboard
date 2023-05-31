import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';

connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.get('/', (req, res) => res.send("Server is ready"));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
/*
5 types of request most common
**POST /api/users** - Register a user
**POST /api/users/auth** - Authenticate a user and get token
**POST /api/users/logout** - Logout user and clean cookie
**GET /api/users/profile** - Get user profile
**PUT /api/users/profile** - Update user profile
*/