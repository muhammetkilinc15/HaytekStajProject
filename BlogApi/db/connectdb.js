// database/connectDb.js
import { Sequelize } from 'sequelize';
import dotnev from 'dotenv';
dotnev.config();

// database connection
export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
});



export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('connected to database');
    } catch (error) {
        console.error('connected database error : ', error);
        process.exit(1); // exit with failure 
    }
};