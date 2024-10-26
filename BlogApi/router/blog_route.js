import express from 'express';
import { createBlog, getAll, getByUrl,updateBlog,deleteBlog, getBlogWithCategories, getById } from '../controllers/blog_controller.js';
import upload from '../utils/image_upload.js';
import { verifyRole } from '../middleware/verifyUserRole.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();


router.get('/getAll', getAll);
router.get('/getByUrl/:url', getByUrl);
router.get('/getByCategory', getBlogWithCategories);
router.get("/:id",getById);



router.post('/createBlog', upload.single('image'), createBlog);
router.put('/updateBlog/:id', verifyToken ,verifyRole(['admin', 'moderator']), updateBlog);
router.delete('/deleteBlog/:id',verifyToken, verifyRole(['admin', 'moderator']), deleteBlog); // Burada deleteBlog fonksiyonu tanımlı mı?

export default router;