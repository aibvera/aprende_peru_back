import orm from "../config/sequelize.js"
import { DataTypes } from "sequelize";

export const Usuario = orm.define('Usuario', {
    id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: { len: [5, 50] } // mínimo 5 caracteres, máximo 50
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    role: {
        type: DataTypes.ENUM('admin', 'super', 'user'),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'users',  // nombre en la BD
    timestamps: false,   // false Si no tienes createdAt/updatedAt
    underscored: true    // convierte nombres a snake_case, si faltara
});
