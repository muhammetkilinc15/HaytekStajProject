import express from 'express';
import { getLogin, getRegister, getVerifyEmail, logout, postLogin, postRegister, postverifyEmail, getresetPassword, postresetPassword, getforgotPassword, postforgotPassword } from '../controllers/auth_controller.js';
const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);

router.get("/register", getRegister);
router.post("/register", postRegister);


router.get("/verify-email", getVerifyEmail);
router.post("/verify-email", postverifyEmail);


router.get("/forgot-password",getforgotPassword);
router.post("/forgot-password",postforgotPassword);


router.get("/reset-password",getresetPassword);
router.get("/reset-password",postresetPassword);


router.post("/logout", logout);


export default router;