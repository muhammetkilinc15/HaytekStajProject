import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async function (req, res, next) {
    try {
        const accessToken = req.session.accessToken; // Token'ı oturumdan al

        if (!accessToken) {
            req.session.user = null; // Kullanıcıyı oturumdan sil
            return next();
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
       

        next();
    } catch (error) {
        console.error("Token doğrulama hatası:", error); // Hata detaylarını konsola yazdır
        req.userRole = null; // Hata durumunda da kullanıcı rolünü null yap
        next(); // Middleware'i sonlandır
    }
};
