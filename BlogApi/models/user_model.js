import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connectdb.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true // null olmasına izin veriyor
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true // null olmasına izin veriyor
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 75] 
        }
    },
    userPhoto : {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastLogin: {
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW  
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordTokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true 
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    verificationTokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true
});

export default User;
