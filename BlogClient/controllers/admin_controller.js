import axios from "axios";
import FormData from 'form-data'; // FormData'ya ihtiyaç var
import dotenv from 'dotenv';
dotenv.config();

// Blog işlemeri 


export const getblogsAdmin = async (req, res) => {
    try {
        console.log("blogs calıstı");

        const categories = (await axios.get(`${process.env.API_URL}/category/getAll`)).data.categories;
        const blogs = await axios.get(`${process.env.API_URL}/blog/getAll`);
        res.render("admin/blog-list", {
            title: "Tüm Bloglar",
            blogs: blogs.data,
            categories: categories

        });
    } catch (error) {
        res.send(error);
    }
}

export const getBlogAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = (await axios.get(`${process.env.API_URL}/blog/${id}`)).data.blog;
        const categories = (await axios.get(`${process.env.API_URL}/category/getAll`)).data.categories;
        res.render("admin/blog-edit", {
            title: "Blog Düzenleme",
            blog: blog,
            categories: categories
        });
    } catch (error) {
        res.render("error", { message: "An error occurred while fetching data." });
    }
}


export const getBlogCreateAdmin = async (req, res) => {
    try {

        const categories = (await axios.get(`${process.env.API_URL}/category/getAll`)).data;

        res.render("admin/blog-create", {
            title: "Blog Oluştur",
            categories: categories,
        });
    } catch (error) {
        res.render("error", { message: "An error occurred while fetching data." });
    }
}

export const postBlogCreateAdmin = async (req, res) => {
    try {
        if (!req.files || !req.files.image || req.files.image.length === 0) {
            return res.status(400).send("Dosya yüklenmedi");
        }

        const image = req.files.image[0];

        if (!image || !image.originalname || !image.mimetype || !image.buffer) {
            return res.status(400).send("Geçersiz dosya formatı");
        }


        const { title, content, subtitle, mainPage, isApproved, categories } = req.body;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('subtitle', subtitle);
        formData.append('mainPage', mainPage === 'on');
        formData.append('isApproved', isApproved === 'on');
        formData.append('userId', req.session.user._id);
        formData.append('image', image.buffer, image.originalname);


        // API'ye form verisini gönder
        const response = await axios.post(`${process.env.API_URL}/blog/createBlog`, formData, {
            headers: {
                ...formData.getHeaders() // FormData'nın otomatik oluşturduğu başlıkları kullan
            }
        });

        console.log("Blog oluşturma yanıtı:", response.status);


        res.render("admin/blogs", {
            title: "Blog Oluştur",
            message: "Blog başarıyla oluşturuldu!"
        });
    } catch (error) {
        console.error("Blog oluşturma sırasında hata:", error);
        res.render("error", { message: "Blog oluşturulurken bir hata meydana geldi." }); // Hata görünümünü kullan
    }
};



// Kategori işlemleri

export const getCategories = async (req, res) => {
    try {
        const categories = (await axios.get(`${process.env.API_URL}/category/getAll`)).data.categories; // Tüm kategorileri al
        res.render("admin/category-list", {
            categories: categories,
            title: "Kategoriler"
        })
    } catch (err) {
        res.status(404).json("hatal")
    }
}

export const getCreateCategory = async (req, res) => {
    try {
        res.render("admin/category-create", {
            title: "Kategori Oluştur"
        });

    } catch (err) {
        console.error("Error fetching category:", err);
        res.status(500).json({ error: "Kategori alınırken bir hata meydana geldi." });
    }
}

export const postCategoryCreateAdmin = async (req, res) => {
    try {
        const { name } = req.body;
        const response = await axios.post(`${process.env.API_URL}/category/create`, {
            name
        });
        if (response.status === 201) {
            res.redirect('/admin/categories');
        } else {
            res.status(response.status).send('Error creating category');
        }
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryResponse = (await axios.get(`${process.env.API_URL}/category/${id}`)).data;

        console.log(categoryResponse)
        const category = categoryResponse.category;
        const blogs = categoryResponse.blogs


        res.render("admin/category-edit", {
            title: "Blog Düzenleme",
            category: category,
            blogs: blogs,
            countBlog: blogs.length
        })

    } catch (err) {
        console.error("Error fetching category:", err);
        res.status(500).json({ error: "Kategori alınırken bir hata meydana geldi." });
    }
};


export const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const response = await axios.put(`${process.env.API_URL}/category/${id}`, {
            name
        });
        if (response.status === 200) {
            res.redirect(`/admin/categories/${id}`);
        } else {
            res.status(response.status).send('Error updating category');
        }
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).send('Internal Server Error');
    }
};



// Kullanıcı işlemleri
export const getRolesWithCount = async (req, res) => {
    try {
        console.log("calıstı");
        const roles = (await axios.get(`${process.env.API_URL}/roles/getAll`)).data;

        res.render("admin/role-list", {
            title: "Roller",
            roles: roles
        });
    } catch (error) {
        console.error("Error fetching roles:", error); // Hata mesajını konsola yazdır
        // JSON yanıtı döndür
        res.status(500).json({ error: "Veri alınırken bir hata oluştu." });
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const usersInfo = (await axios.get(`${process.env.API_URL}/user/userInfo/`)).data;



        res.render("admin/user-list", {
            title: "Kullanıcı Bilgileri",
            usersInfo: usersInfo
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Kullanıcı alınırken bir hata meydana geldi." });
    }
}

export const getUserEdit = async (req, res) => {
    try {
        const {userId} = req.params
        const user = (await axios.get(`${process.env.API_URL}/user/userInfo/${userId}`)).data;
        const roles = (await axios.get(`${process.env.API_URL}/roles/getAll`)).data;
        res.render("admin/user-edit", {
            title: "Kullanıcı Bilgileri",
            userInfo: user,
            roles: roles
        });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Kullanıcı alınırken bir hata meydana geldi." });
    }
};