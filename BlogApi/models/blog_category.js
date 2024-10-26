import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connectdb.js';

const BlogCategory = sequelize.define('BlogCategory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
{
    tableName: 'blog_categories',
    timestamps: false,
});

export default BlogCategory;