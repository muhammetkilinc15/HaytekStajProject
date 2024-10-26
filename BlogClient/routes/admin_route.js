import express from 'express';
import { editCategory, getBlogAdmin, getBlogCreateAdmin, getblogsAdmin, getCategories, getCategoryById, getCreateCategory, getRolesWithCount, getUserEdit, getUserInfo, postBlogCreateAdmin, postCategoryCreateAdmin } from '../controllers/admin_controller.js';

import multer from 'multer';
// Multer configuration
const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({ storage: storage }).fields([{ name: 'image', maxCount: 1 }]);



const router = express.Router();
router.get("/blogs",getblogsAdmin)
router.get("/blogs/:id",getBlogAdmin)


router.get("/blog/create",getBlogCreateAdmin)
router.post('/blog/create', upload, postBlogCreateAdmin);

router.get("/categories/:id",getCategoryById)
router.post("/categories/:id",editCategory)

router.get("/categories",getCategories)

router.get("/category/create",getCreateCategory)
router.post('/category/create', postCategoryCreateAdmin);


router.get("/users",getUserInfo)
router.get("/users/:userId",getUserEdit)



router.get("/roles",getRolesWithCount)


export default router;