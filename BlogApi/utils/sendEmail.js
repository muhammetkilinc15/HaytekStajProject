import nodemailer from 'nodemailer';
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail kullanıyoruz
  auth: {
    user: process.env.GMAIL_USER, // .env dosyasındaki Gmail kullanıcı adı
    pass: process.env.GMAIL_PASS // .env dosyasındaki Gmail şifresi (uygulama şifresi)
  }
});

export const sendVerificationEmail = async (user) => {
  try {
    console.log("Sending verification email to", user.email);
    const response = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "E-postanızı doğrulayın",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", user.verificationToken).replace("{username}", user.username),
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (user, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Şifrenizi sıfırlayın",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL).replace("{username}", user.username),
    });
    console.log("Password reset email sent successfully", response);
    
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await _mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};