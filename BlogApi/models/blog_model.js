import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connectdb.js';
const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image : {
        type: DataTypes.STRING,
        allowNull: false,   
    },
    url : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    mainPage : {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isApproved : {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    userId : {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique : false
    }
},
{
    tableName: 'blogs',
    timestamps: true,
});

export default Blog;