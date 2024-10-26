import express from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory } from '../controllers/category_controller.js';
const router = express.Router();




router.post('/create', createCategory); // Create a new category
router.get('/getall', getCategories); // Get all categories
router.get('/:id', getCategoryById); // Get a category by ID
router.put("/:id", updateCategory); // Update a category by ID
router.post("/create", createCategory); // Create a new category

export default router;