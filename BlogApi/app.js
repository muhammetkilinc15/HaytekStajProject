import express from 'express';
import dotenv from 'dotenv'; // Import the dotenv library
import cookieParser from 'cookie-parser'; // Import the cookie-parser library

// Import the connectDB function from the db/connectdb.js file
import { connectDB, sequelize } from './db/connectdb.js';
import { dbAsync } from './db/dbAsync.js';


// Import routes
import auth_route from './router/auth_route.js';
import blog_route from './router/blog_route.js';
import category_route from './router/category_route.js';
import role_route from './router/role_route.js';
import user_route from './router/user_route.js';


dotenv.config(); // Load environment variables from a .env file into process.env


const app = express();

// Middleware
app.use(express.json()); // For JSON data
app.use(cookieParser()); // Parse incoming cookies


// 'public/images' klasörünü statik dosya olarak herkese açık hale getirin
app.use('/images', express.static('public/images'));



// routes
app.use("/api/auth", auth_route);
app.use("/api/blog",blog_route );
app.use("/api/category",category_route)
app.use("/api/roles",role_route);
app.use("/api/user",user_route);









const startServer = async () => {
    // Connect to the database
    await connectDB();

    // Tabloları senkronize et

    dbAsync();


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on  http://localhost:${PORT}`);
    });
};

startServer();