import express from 'express';
import { getAllRoleWithCount } from '../controllers/role_controller.js';
const router = express.Router();


router.get("/getAll",getAllRoleWithCount);





export default router;