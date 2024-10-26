import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import blog_routes from './routes/blog_routes.js';
import home_routes from './routes/home_routes.js';
import auth_routes from './routes/auth_route.js';
import admin_routes from './routes/admin_route.js';
import { authMiddleware } from './middleware/auth_middleware.js';

dotenv.config();

const app = express();


// middlewares


app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // URL encoded for form data
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET, // Güvenlik için gizli anahtar
    resave: false, 
    saveUninitialized: true,  
    cookie: { secure: process.env.NODE_ENV === 'production' } // Sadece HTTPS üzerinden gönder
}));

app.use(authMiddleware);




app.set("view engine", "ejs");
app.use('/node_modules', express.static('node_modules'));
app.use('/public', express.static('public'));

app.use((req, res, next) => {
    res.locals.user = req.session.user; 
    next();
});



// routes
app.use("/", home_routes);
app.use("/account/", auth_routes);
app.use("/blogs",blog_routes);
app.use("/admin", admin_routes);





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Client is running on http://localhost:${PORT}`);
});