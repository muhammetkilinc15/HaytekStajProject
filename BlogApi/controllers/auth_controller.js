import User from "../models/user_model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import { generateTokenSetCookie } from "../utils/generateTokenSetCookie.js";
import { Op } from 'sequelize'; // require yerine import kullandık
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/sendEmail.js";
import { registerValidator } from "../validators/user_validator.js";
import UserRole from "../models/user_role.js";

dotenv.config();

export const register = async (req, res) => {
    try {

        const { error } = registerValidator(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { username, email, password } = req.body;
        // Check if the user already exists
        const userExists = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const now = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
        console.log(now);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            userPhoto : "userPhoto.png",
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
        });

        const response = await UserRole.create({
            userId: user.id,
            roleId: 3 // Default role is user so misafir 
        });

        sendVerificationEmail(user);
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        // Email veya username ve şifre boş olamaz
        if (!emailOrUsername || !password) {
            throw new Error("All fields are required");
        }
    
        // Kullanıcıyı email veya username ile bul
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            }
        });
      

        if (!user) {
            throw new Error("User not found");
        }

        // Kullanıcının doğrulanıp doğrulanmadığını kontrol et
        if (!user.isVerified) {
            throw new Error("Please verify your email");
        }

        // Şifre kontrolü
        const isPasswordMatch = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Invalid credentials");
        }

        // JWT oluştur ve çerezlere set et
        generateTokenSetCookie(res, user);

        // Son giriş zamanını güncelle
        user.lastLogin = Date.now();
        await user.save();

        // Başarılı giriş yanıtı
        return res.status(200).json({
            status: true,
            message: "Login successfully",
            user: {
                ...user.toJSON(), // _doc yerine toJSON() kullanmak daha güvenli
                password: undefined // Şifreyi yanıtta göstermeyin
            }
        });
    } catch (error) {
        // Hata durumunda yanıt gönder
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
};


export const checkAuth = async (req, res) => {
    try {
        const user = await User.findByPk(req.user._id);
        if (!user) {
            throw new Error("User not found");
        }

        return res.status(200).json({
            status: true,
            user: {
                ...user.toJSON(),
                password: undefined
            }
        });

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        });


    };
};


export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            where: {
                verificationToken: code,
                verificationTokenExpiresAt: {
                    [Op.gt]: Date.now()  // Token süresinin henüz geçmediğini kontrol et
                }
            }
        });

        if (!user) {
            throw new Error("Invalid or expired verification code");
        }

        user.isVerified = true;
        user.verificationToken = null; // undefined yerine null kullanmak daha iyi olabilir
        user.verificationTokenExpiresAt = null;
        await user.save();

        return res.status(200).json({
            status: true,
            message: "Email verified successfully",
            user: {
                ...user.toJSON(), // _doc yerine toJSON() kullanmak daha doğru olabilir
                password: undefined
            }
        });

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
}


export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            throw new Error("Email is required")
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found")
        }
        const resetToken = await crypto.randomBytes(32).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours

    
        // save reset token and expires in database
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

          // send email with reset token
          await sendPasswordResetEmail(user, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);


        return res.status(200).json({
            status: true,
            message: "Reset token sent to your email"
        })
    }
    catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            throw new Error("Invalid or expired reset token")
        }
        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();
        await sendResetSuccessEmail(user.email);

        return res.status(200).json({
            status: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}



export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        status: true,
        message: "Logout successfully"
    })
}