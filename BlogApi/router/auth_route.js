import express from 'express';
import { checkAuth, forgotPassword, login, logout, register, resetPassword, verifyEmail } from '../controllers/auth_controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();


router.post("/register",register);
router.post("/login",login);
router.get("/check-auth",verifyToken,checkAuth)
router.post("/verify-email",verifyEmail)



router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token",resetPassword)
router.post("/logout",logout)


export default router;