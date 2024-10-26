import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();    


export const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({
        status: false,
        message: "Unauthorized - no token provided"
        })
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized - invalid token"
        })
    }
};