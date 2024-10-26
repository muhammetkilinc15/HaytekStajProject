import express from 'express';
import { getUserInfo, getUsersInfo } from '../controllers/user_controller.js';
const router = express.Router();

router.get("/userInfo",getUsersInfo)
router.get("/userInfo/:userId",getUserInfo)




export default router; // Export the router object