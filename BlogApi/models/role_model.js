import { sequelize } from "../db/connectdb.js";
import { DataTypes } from "sequelize";

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
},{
    tableName: 'roles',
    timestamps: false,
});

export default Role;