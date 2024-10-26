import { sequelize } from "../db/connectdb.js";
import { DataTypes } from "sequelize";

const UserRole = sequelize.define('UserRole', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
{
    tableName: 'user_roles',
    timestamps: false,
});

export default UserRole;