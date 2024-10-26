import express from 'express';
import { getBlogByUrl, getBlogCreate, getBlogs, getBlogsByCategory, postBlogCreate } from '../controllers/blog_controller.js';

const router = express.Router();



router.get('/', getBlogs);
router.get('/category/:categoryUrl', getBlogsByCategory);
router.get('/:url', getBlogByUrl);

router.get("/blogs",async (req,res)=>{
    console.log("blogs");

    const blogs = await axios.get(`${process.env.API_URL}/blog/getAll`);
    res.render("/admin/blog-list",{  
        title:"Tüm Bloglar",
        blogs:blogs
    }); 
});

router.get("/blog/create",getBlogCreate);
router.post("/blog/create",postBlogCreate);



export default router;