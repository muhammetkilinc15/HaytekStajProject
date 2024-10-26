import axios from "axios";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const getLogin = async function (req, res) {
    try {
        // Kullanıcı rolünü kontrol et
        const userRole = req.cookies['access-token'] ? jwt.verify(req.cookies['access-token'], process.env.JWT_SECRET).roles[0] : null;

        res.render("auth/login", {
            title: "Giriş Yap",
            userRole: userRole
        })
    } catch (error) {
        res.send(error);
    }
}

export const postLogin = async function (req, res) {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).send("E-posta/şifre alanları boş bırakılamaz.");
        }

        // API'ye istek gönder
        const response = await axios.post(`${process.env.API_URL}/auth/login`, {
            emailOrUsername,
            password
        }, {
            withCredentials: true, // Çerezleri kullan
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // API'den gelen yanıtı kontrol et
        if (response.headers['set-cookie']) {
            // Çerezi al
            const setCookieHeader = response.headers['set-cookie'][0];
            const token = setCookieHeader.split(';')[0].split('=')[1];  
            req.session.accessToken = token; // Oturum verisine token'ı ekle
            const decoded = jwt.decode(token, process.env.JWT_SECRET);
            req.session.user = decoded.user;
            // Ana sayfaya yönlendir
            return res.redirect("/");
        } else {
            return res.status(401).send("Giriş başarısız. Lütfen tekrar deneyin.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
}

export const getRegister = async function (req, res) {
    try {
        res.render("auth/register", {
            title: "Kayıt Ol"
        });
    } catch (error) {
        res.send(error);
    }
}

export const postRegister = async function (req, res) {
    try {
        const { username, email, password } = req.body;
        const response = await axios.post(`${process.env.API_URL}/auth/register`, {
            username,
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
           res.render("auth/verifyEmail",{
                title: "E-posta Doğrulama"    
           })
        }

    } catch (error) {
        console.error(error);
        res.render("auth/register", {
            title: "Kayıt Ol",
            error: "Kayıt başarısız. Lütfen tekrar deneyin."
        });
    }
}

export const getVerifyEmail = async (req, res) => {
    res.render("auth/verifyEmail",{
        title: "E-posta Doğrulama", 
    });
}

export const postverifyEmail = async function (req, res) {
    try {
        const verificationCode = req.body.verificationCode
        console.log(verificationCode);
        const response = await axios.post(`${process.env.API_URL}/auth/verify-email`, {
            code: verificationCode
        });
          
        if (response.status === 200) {
            res.render("auth/login", {
                title: "Giriş Yap",
                success: "E-posta doğrulandı. Giriş yapabilirsiniz."
            });
        }
    } catch (error) {

    }
}

export const getforgotPassword = async function (req, res) {
    try {
        res.render("auth/forgot-password", {
            title: "Şifremi Unuttum"
        });
    } catch (error) {
        res.render();
    }   
}

export const postforgotPassword = async function (req, res) {
    try {
        const { email } = req.body;
        console.log(email);
        const response = await axios.post(`${process.env.API_URL}/auth/forgot-password`, {
            email
        });

        if (response.status === 200) {
            res.render("auth/login", {
                title: "Giriş Ekranı",
            });
        }
    } catch (error) {
        res.send(error);
    }
}





export const getresetPassword = async function (req, res) {
    try {
        res.render("auth/reset-password", {
            title: "Şifre Sıfırlama"
        });
    } catch (error) {
        res.send(error);
    }
}

export const postresetPassword = async function (req, res) {
    try {
        const { email } = req.body;
        const response = await axios.post(`${process.env.API_URL}/auth/forgot-password`, {
            email
        });

        if (response.status === 200) {
            res.render("auth/reset-password", {
                title: "Şifre Sıfırlama",
                success: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
            });
        }


        res.render("auth/reset-password", {
            title: "Şifre Sıfırlama"
        });
    } catch (error) {
        res.send(error);
    }
}



export const logout = async function (req, res) {
    try {
        // Çıkış yap
        req.session.destroy();
        res.clearCookie('access-token');
        res.redirect("/");
    } catch (error) {
        res.send(error);
    }
}