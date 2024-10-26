import jwt from 'jsonwebtoken';
import { UserRole, Role } from '../models/index.js';
import crypto from 'crypto';

export const generateTokenSetCookie = async (res, user) => {
    try {
        // Get user roles from UserRole table
        const userRoles = await UserRole.findAll({ where: { userId: user.id }, include: Role });
        
        // Check if userRoles is empty
        if (!userRoles || userRoles.length === 0) {
            console.warn(`No roles found for user ID: ${user.id}`);
        }
        // Extract role names
        const roles = userRoles.map(userRole => userRole.Role.roleName);

        // Generate token
        const token = jwt.sign({
            user:{
                _id: user.id,
                roles: roles,
                firstName: user.firstName,
                lastName: user.lastName,
                userPhoto:  `http://localhost:1907/images/`+ user.userPhoto,
            }
        }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Set cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            httpOnly: true, // The cookie is not available via JavaScript in the browser
            sameSite: 'None', // cross-site request forgery (CSRF) protection
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };
        
        // Set the cookie
        res.cookie('accessToken', token, cookieOptions);
        return token;
    } catch (error) {
        console.error('Error generating token and setting cookie:', error);
        throw new Error('Could not generate token or set cookie');
    }
};
