import { Blog, BlogCategory, Category } from "../models/index.js";
import slugField from "../utils/slugfield.js";
import { categoryValidator } from "../validators/category_validator.js";
import dotenv from 'dotenv';
dotenv.config();


// Categories 
export const createCategory = async (req, res) => {
    try {
        const { error } = categoryValidator.validate(req.body); // Burada `validate` metodunu kullanmalısınız
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { name } = req.body;
        const category = await Category.create({ name, url : slugField(name) });
        res.status(201).json({ category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({ categories });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Kategori bulunamadı" });
        }
        const blogCategories = await BlogCategory.findAll({ where: { categoryId: id } });

        const blogIds = blogCategories.map(item => item.blogId);

        // Sadece id ve image alanlarını almak için attributes kullan
        const blogs = await Blog.findAll({
            where: { id: blogIds },
            attributes: ['id', 'image','title'] // İstenilen alanlar
        });

        // Blogları dönüştürerek imageUrl ekleyin
        const transformedBlogs = blogs.map(blog => ({
            id: blog.id,
            imageUrl: `${process.env.BASE_URL}/images/${blog.image}`, // Burada BASE_URL ve image yolu birleştiriliyor
            title: blog.title // Title da dönülsün
        }));

        console.log(transformedBlogs);
        // Kategoriyi ve dönüştürülmüş blogları döndür
        res.status(200).json({ category, blogs: transformedBlogs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { error } = categoryValidator.validate(req.body);  
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { id } = req.params;
        const { name } = req.body;

        // Kategori bulunup bulunmadığını kontrol et
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Kategori bulunamadı" });
        }

        // Kategori adını güncelle ve kaydet
        category.name = name;
        category.url = slugField(name);
        await category.save();

        // Güncellenmiş kategoriyi döndür
        return res.status(200).json({ message: "Kategori başarıyla güncellendi", category });
    } catch (error) {
        console.error("Kategori güncellenirken hata:", error);
        res.status(500).json({ error: "Kategori güncellenirken bir hata meydana geldi." });
    }
}


// Roles 
