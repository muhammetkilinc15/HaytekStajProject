import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();


// exports.blogs_details = async function(req, res) {
//     const slug = req.params.slug;
//     try {
//        const  blog = axios.get()

//         if(blog) {
//             return res.render("users/blog-details", {
//                 title: blog.baslik,
//                 blog: blog,
              
//             });
//         }
//         res.redirect("/");
//     }
//     catch(err) {
//         console.log(err);
//     }
// }

exports.blog_list = async function(req, res) {
    const size = 5;
    const { page = 0 } = req.query;
    const slug = req.params.slug;

    try {
        const {rows, count} = await Blog.findAndCountAll({ 
            where: { onay: {[Op.eq]: true } },
            raw: true,
            include: slug ? { model: Category, where: { url: slug } } : null,
            limit: size,
            offset: page * size 
        });
        const categories = await Category.findAll({ raw: true });

        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: rows,
            totalPages : Math.ceil(count / size),
            currentPage : page,
            totalItems : count,
            categories: categories,
            selectedCategory: slug,     
        })
    }
    catch(err) {
        console.log(err);
    }
}

exports.index = async function(req, res) {
    console.log(req.cookies)
    try {
        const blogs = await Blog.findAll({
            where: {
                [Op.and]: [
                    { anasayfa: true },
                    { onay: true }
                ]
            },
            raw: true
        });
        const categories = await Category.findAll({ raw: true });

        res.render("users/index", {
            title: "Popüler Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: null,
            // isAuth : req.cookies.isAuth // cookie ile alırken
            // isAuth : req.session.isAuth
        })
    }
    catch(err) {
        console.log(err);
    }
}