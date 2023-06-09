import express from "express";
import {
    registerUser,
    authUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
} from "../controllers/userController.js";
import { protect } from '../middleware/authMiddleware.js';
import { body } from "express-validator";

const router = express.Router();

const checker = [
    body("email")
        .isEmail()
        .withMessage('Invalid email address'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character')
]

router.post("/", checker, registerUser);

router.post("/auth", checker, authUser);
router.post("/logout", logoutUser);
router.route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

export default router;