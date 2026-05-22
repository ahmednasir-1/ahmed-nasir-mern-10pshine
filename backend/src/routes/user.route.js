import express from "express";
import { registerUser, loginUser, verifyEmail, getProfile, changePassword, updateProfile, forgotPassword, resetPassword } from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js"
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router;