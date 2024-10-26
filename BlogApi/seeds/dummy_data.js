import slugField from "../utils/slugfield.js";
import bcrypt from "bcryptjs";

import { User, Role, Category, Blog, BlogCategory, UserRole } from "../models/index.js";

// Define base path for images


export const dummy_data = async function populate() {
    const count = await Category.count();
   
    if (count == 0) {

        const count = await Category.count();

        if (count == 0) {

            const users = await User.bulkCreate([
                { firstName: "Muhammet", lastName: "Kılınç",isVerified: true, username: "mami07", userPhoto : "userPhoto.png", email: "mhmmtklnc15@gmail.com", password: await bcrypt.hash("12345", 10) },
                { firstName: "Beyza", lastName: "Akkoç", username: "beyza07", email: "beyza15@gmail.com", password: await bcrypt.hash("12345", 10) },
                { firstName: "Deniz Furkan", lastName: "Kanbak",isVerified: true, username: "osman15", email: "osman@gmail.com", password: await bcrypt.hash("12345", 10) },
                { firstName: "Ugur", lastName: "Tansal", username: "ugur31", email: "ugur@gmail.com", password: await bcrypt.hash("12345", 10) },
            ]);

            const roles = await Role.bulkCreate([
                { roleName: "admin" },
                { roleName: "modaratör" },
                { roleName: "Misafir" },
            ])

            await UserRole.bulkCreate([
                { userId: 1, roleId: 1 }, // admin
                {userId : 1, roleId: 2},
                { userId: 2, roleId: 2 }, // modaratör
                { userId: 3, roleId: 3 }, // Misafir
                { userId: 4, roleId: 2 } // modaratör
            ]);


            const categories = await Category.bulkCreate([
                { name: "Web Geliştirme", url: slugField("Web Geliştirme"), },
                { name: "Mobil Geliştirme", url: slugField("Mobil Geliştirme"), },
                { name: "Programlama", url: slugField("Programlama"), }
            ]);

            const blogs = await Blog.bulkCreate([
                {
                    id: 1,
                    title: "Web Geliştirmeye Giriş: Temel Kavramlar ve Araçlar",
                    url: slugField("Web Geliştirmeye Giriş: Temel Kavramlar ve Araçlar"),
                    subtitle: "HTML, CSS ve JavaScript ile Web Geliştirme Temelleri",
                    content: "Web geliştirme, internetteki siteleri oluşturan karmaşık bir süreçtir. Bu yazıda, HTML, CSS ve JavaScript gibi temel teknolojilerin yanı sıra, Sass ve Bootstrap gibi modern araçları kullanarak etkileyici ve işlevsel web siteleri oluşturmayı öğreneceksiniz. Hem görsel tasarım hem de dinamik içerik için gereken tüm araçları keşfedeceğiz.",
                    image: "1.jpeg",
                    mainPage: true,
                    isApproved: true,
                    userId: 3
                },
                {
                    id: 2,
                    title: "Python: Başlangıçtan İleri Seviyeye Yolculuk",
                    url: slugField("Python: Başlangıçtan İleri Seviyeye Yolculuk"),
                    subtitle: "Veri Bilimi, Web Geliştirme ve Daha Fazlası için Python",
                    content: "Python, basit sözdizimi ve güçlü kütüphaneleri ile hem yeni başlayanlar hem de deneyimli geliştiriciler için popüler bir dildir. Bu yazıda, Python ile veri analizi, web geliştirme ve otomasyon konularında derinlemesine bilgi edinecek ve projelerinizde nasıl uygulayabileceğinizi öğreneceksiniz.",
                    image: "2.jpeg",
                    mainPage: false,
                    isApproved: true,
                    userId: 2
                },
                {
                    id: 3,
                    title: "Modern JavaScript: ES6 ve Ötesi",
                    url: slugField("Modern JavaScript: ES6 ve Ötesi"),
                    subtitle: "JavaScript ile Dinamik Uygulamalar Geliştirin",
                    content: "JavaScript, web geliştirme dünyasının vazgeçilmez bir parçasıdır. Bu yazıda, ES6 ve daha yeni sürümlerin özelliklerini kullanarak daha temiz ve etkili kod yazmanın yollarını öğreneceksiniz. Ayrıca, Node.js ve çeşitli frameworklerle (Angular, React, VueJs) uygulama geliştirmeye dair ipuçları bulacaksınız.",
                    image: "3.jpeg",
                    mainPage: false,
                    isApproved: true,
                    userId: 2
                },
                {
                    id: 4,
                    title: "React ile Etkileşimli Web Uygulamaları Geliştirmek",
                    url: slugField("React ile Etkileşimli Web Uygulamaları Geliştirmek"),
                    subtitle: "React Hooks ve Redux ile Modern Web Geliştirme",
                    content: "React, kullanıcı arayüzü geliştirmede en popüler kütüphanelerden biridir. Bu yazıda, React kullanarak etkileşimli ve performanslı web uygulamaları geliştirmeyi öğrenirken, Hooks ve Redux gibi önemli araçları da keşfedeceksiniz. Hedefimiz, modern web geliştirmeye dair güçlü bir temel oluşturmak.",
                    image: "4.jpeg",
                    mainPage: false,
                    isApproved: true,
                    userId: 3
                },
                {
                    id: 5,
                    title: "Node.js ile Sunucu Tarafı Geliştirme",
                    url: slugField("Node.js ile Sunucu Tarafı Geliştirme"),
                    subtitle: "JavaScript ile Sunucu Uygulamaları Geliştirmenin Yolları",
                    content: "Node.js, JavaScript'i sunucu tarafında kullanmanıza olanak tanır. Bu yazıda, Node.js ile API geliştirme, veritabanı bağlantıları ve gerçek zamanlı uygulamalar oluşturma konularını keşfedeceksiniz. Bu bilgi, sizi tam yığın (full-stack) geliştirici olma yolunda ileri taşıyacak.",
                    image: "5.jpg",
                    mainPage: false,
                    isApproved: true,
                    userId: 2
                },
                {
                    id: 6,
                    title: "Angular ile Dinamik Web Uygulamaları Geliştirme",
                    url: slugField("Angular ile Dinamik Web Uygulamaları Geliştirme"),
                    subtitle: "Modern Web Uygulamaları için Angular Kullanımı",
                    content: "Angular, güçlü bir front-end framework'tür. Bu yazıda, Angular kullanarak dinamik ve ölçeklenebilir web uygulamaları oluşturmanın temellerini öğreneceksiniz. Uygulamalarınızı nasıl daha verimli hale getirebileceğinizi keşfedeceksiniz.",
                    image: "6.jpg",
                    mainPage: false,
                    isApproved: true,
                    userId: 3
                },
                {
                    id: 7,
                    title: "PHP ile Dinamik Web Geliştirme",
                    url: slugField("PHP ile Dinamik Web Geliştirme"),
                    subtitle: "PHP ile Etkili Web Uygulamaları Tasarlamak",
                    content: "PHP, sunucu tarafında yaygın olarak kullanılan bir programlama dilidir. Bu yazıda, PHP ile dinamik web sayfaları oluşturma, veritabanı entegrasyonu ve kullanıcı etkileşimi konularını ele alıyoruz. Bu bilgiler, web projelerinizi güçlendirecek.",
                    image: "7.jpg",
                    mainPage: false,
                    isApproved: true,
                    userId: 3
                },
                {
                    id: 8,
                    title: "ASP.NET Core ile Modern Web Geliştirme",
                    url: slugField("ASP.NET Core ile Modern Web Geliştirme"),
                    subtitle: "ASP.NET Core ile Güçlü Web Uygulamaları Oluşturun",
                    content: "ASP.NET Core, yüksek performanslı web uygulamaları geliştirmek için ideal bir platformdur. Bu yazıda, ASP.NET Core ile uygulama mimarisi, RESTful API geliştirme ve veri yönetimi konularını keşfedeceksiniz. Öğrendiklerinizle profesyonel projeler geliştirebileceksiniz.",
                    image: "8.jpg",
                    mainPage: false,
                    isApproved: true,
                    userId: 2
                },
                {
                    id: 9,
                    title: "Django ile Python ile Web Geliştirme",
                    url: slugField("Django ile Python ile Web Geliştirme"),
                    subtitle: "Python ile Dinamik Web Uygulamaları Geliştirin",
                    content: "Django, Python ile web uygulamaları geliştirmek için popüler bir framework'tür. Bu yazıda, Django'nun avantajları, MVC mimarisi ve veri yönetimi konularını ele alarak, projelerinizi nasıl daha hızlı geliştirebileceğinizi öğreneceksiniz.",
                    image: "9.jpg",
                    mainPage: false,
                    isApproved: true,
                    userId: 3
                }
            ]);
            

            await BlogCategory.bulkCreate([
                { blogId: 1, categoryId: 1 },
                { blogId: 2, categoryId: 3 },
                { blogId: 3, categoryId: 1 }
            ]);
        }

    }
}

export default dummy_data;