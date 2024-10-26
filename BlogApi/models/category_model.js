import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connectdb.js';


const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    url : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
},
{
    tableName: 'categories',
    timestamps: false,
});


export default Category;
