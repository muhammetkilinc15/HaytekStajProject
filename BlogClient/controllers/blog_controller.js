import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

export const getBlogs = async (req, res) => {
    try {
        const blogs = await axios.get(`${process.env.API_URL}/blog/getAll`);
        const categories = (await axios.get(`${process.env.API_URL}/category/getAll`)).data.categories;
        const categoryUrl = req.params.categoryUrl;
        res.render("users/blogs", {
            blogs: blogs.data,
            title: "Tüm Bloglar",
            userRole: req.userRole,
            categories: categories,
            selectedCategory: categoryUrl

        });
    } catch (error) {
        res.send(error);
    }
};

export const getBlogsByCategory = async (req, res) => {
    try {
        const categoryUrl = req.params.categoryUrl;
        const blogs = (await axios.get(`${process.env.API_URL}/blog/getByCategory?category=${categoryUrl}`)).data.blogs;    
        const categories = (await axios.get(`${process.env.API_URL}/category/getAll`)).data.categories;
        res.render("users/blogs", {
            blogs: blogs,
            title: "Tüm Bloglar",
            userRole: req.userRole,
            selectedCategory: categoryUrl || null,
            categories: categories,
        });
    } catch (error) {
        console.error(error); // Hata durumunda konsola yazdır
        res.render("error", { message: "An error occurred while fetching data." }); // Hata mesajı
    }
};

export const getBlogByUrl = async (req, res) => {
    try {
        const blog = (await axios.get(`${process.env.API_URL}/blog/getByUrl/${req.params.url}`)).data;
        console.log(blog)
        res.render("users/blog-details", {
            title: "Blog Detayı",
            blog: blog,
            userRole: req.userRole
        });
    } catch (error) {
        res.render("error", { message: "An error occurred while fetching data." });
    }
}

export const getBlogCreate = async (req, res) => {
        try{
            res.render("admin/blog-create", {
                title: "Blog Oluştur",
            });


        }catch(error){
            res.render("error", { message: "An error occurred while fetching data." });
        }
}


export const postBlogCreate = async (req, res) => {
    try {
        console.log('Uploaded file:', req.file); // req.file'in içeriğini kontrol et

        const userId = req.body.userId;

        const { error } = createBlogValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const { title, subtitle, content, mainPage, isApproved } = req.body;

        // Eğer dosya yoksa, hata mesajı döndürelim
        if (!req.file) {
            return res.status(400).json({ message: "Resim yüklenmedi" });
        }

        const image = req.file.filename; // Eğer Multer konfigürasyonu doğruysa, filename burada olur
        const url = slugField(title); // Slug oluşturma işlemi

        // URL'nin benzersiz olduğunu kontrol et
        const existingBlog = await Blog.findOne({ where: { url } });
        if (existingBlog) {
            return res.status(400).json({ message: "Blog with this URL already exists" });
        }

        // Blog kaydını oluştur
        const blog = await Blog.create({ title, subtitle, image, content, mainPage, isApproved, userId, url });
        console.log("Created blog:", blog);

        return res.status(201).json(blog);
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ message: error.message });
    }
}


//       <%- include("../partials/pagination")  %> 
