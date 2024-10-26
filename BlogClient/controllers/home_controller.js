import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();


export const index = async function (req, res) {
    try {


        const categoryUrl = req.query.category; // Kategori URL'sini al
        const blogs = (await axios.get(`${process.env.API_URL}/blog/getAll?mainPage=true`)).data; // Tüm blogları al
        const categories = (await axios.get(`${process.env.API_URL}/category/getAll`)).data.categories; // Tüm kategorileri al
        res.render("home/index", {
            title: "Popüler Bloglar",
            blogs: blogs,
            categories: categories,
            selectedCategory: categoryUrl || null, // Seçilen kategori
            userRole: req.userRole // Kullanıcı rolü
        });
    } catch (error) {
        console.error(error); // Hata durumunda daha fazla bilgi yazdır
        res.status(500).send("An error occurred while fetching data."); // Hata mesajı
    }
}

