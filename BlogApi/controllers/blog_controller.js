import slugField from "../utils/slugfield.js";
import { Blog, BlogCategory, Category } from "../models/index.js";
import { createBlogValidator, deleteBlogValidator, updateBlogValidator } from "../validators/blog_validator.js";

export const getAll = async (req, res) => {
    try {
        const isMainPage = req.query.mainPage === "true"; // Check if mainPage is set to true
        const isApproved = req.query.isApproved === "true"; // Check if isApproved is set to true

        const whereClause = {};

        // Check the value of isMainPage
        if (req.query.mainPage !== undefined) {
            whereClause.mainPage = isMainPage; // true ya da false değerini kullan
        }

        // Check the value of isApproved
        if (req.query.isApproved !== undefined) {
            whereClause.isApproved = isApproved; // true ya da false değerini kullan
        }

        const blogs = await Blog.findAll({
            where: whereClause,
            attributes: ['id', 'title', 'subtitle', 'image', 'url']
        }); // Include the where clause in the query
        const blogsWithImageUrls = blogs.map(blog => ({
            ...blog.dataValues,
            imageUrl: blog.image ? `${req.protocol}://${req.get('host')}/images/${blog.image}` : null
        }));

        return res.json(blogsWithImageUrls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByPk(id, {
            attributes: {exclude: ['createdAt', 'updatedAt']}, // createdAt ve updatedAt alanlarını almayın
            include: {
                model: Category,
                as: 'categories', // ilişki tanımında "categories" olarak adlandırıldığını varsayıyoruz
                attributes: ['id', 'name'] // sadece gerekli alanları alıyoruz
            }
        });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const blogWithImageUrl = {
            blog: {
                ...blog.dataValues,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${blog.image}`,
            },
            categories: blog.categories // kategorileri ekliyoruz
        };

        return res.json(blogWithImageUrl);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




export const getByUrl = async (req, res) => {
    try {
        const { url } = req.params;
        const blog = await Blog.findOne({ where: { url } });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const blogWithImageUrl = {
            ...blog.dataValues,
            imageUrl: blog.image ? `${req.protocol}://${req.get('host')}/images/${blog.image}` : null // image alanından URL oluştur
        };

        return res.json(blogWithImageUrl);
    } catch (error) {
        res.status(500).json({ message: error.message }); // Hata durumunda 500 döndür
    }
}

export const createBlog = async (req, res) => {
    try {
        const { error } = createBlogValidator(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        const { title, subtitle, content, mainPage, isApproved, userId } = req.body;

        // Dosya kontrolü
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const image = req.file.filename;
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
        if (error.errors) {
            console.error("Validation errors:", error.errors);
        }
        res.status(500).json({ message: error.message });
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { errors } = deleteBlogValidator.validate({ id });
        if (errors) {
            return res.status(400).json({ message: errors.message });
        }

        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        await blog.destroy();
        return res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateBlog = async (req, res) => {
    try {
        const { errors } = updateBlogValidator.validate(req.body);
        if (errors) {
            return res.status(400).json({ message: errors.message });
        }

        const { id } = req.params;
        const { title, subtitle, content, mainPage, isApproved } = req.body;
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        blog.title = title;
        blog.subtitle = subtitle;
        blog.content = content;
        blog.mainPage = mainPage;
        blog.isApproved = isApproved;
        blog.userId = userId;
        await blog.save();
        return res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addBlogCategort = async (req, res) => {
    try {
        const { blogId, categoryId } = req.body;
        const blog = await Blog.findByPk(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const blogCategory = await BlogCategory.create({ blogId, categoryId });
        return res.json(blogCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getBlogWithCategories = async (req, res) => {
    try {
        const { category } = req.query;
        // Find the category by URL
        const catID = await Category.findOne({ where: { url: category } });
        if (!catID) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Find all blog IDs associated with the category
        const blogsIds = await BlogCategory.findAll({ where: { categoryId: catID.id } });

        if (!blogsIds || blogsIds.length === 0) {
            return res.status(200).json({ blogs: [], message: "No blogs found for this category" });
        }

        // Find all blogs associated with the blog IDs
        const blogs = await Blog.findAll({ where: { id: blogsIds.map(b => b.blogId) } });

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ blogs: [], message: "No blogs found" });
        }

        // Create the blogs array with the constructed imageUrl
        const blogsWithImageUrls = blogs.map(blog => ({
            ...blog.dataValues,
            imageUrl: blog.image ? `${req.protocol}://${req.get('host')}/images/${blog.image}` : null
        }));

        // Return the blogs with their details, including the constructed image URL
        return res.json({ blogs: blogsWithImageUrls });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
