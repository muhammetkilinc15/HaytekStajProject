import express from 'express';
import { index } from '../controllers/home_controller.js';

const router = express.Router();


router.get("/",index);

export default router;