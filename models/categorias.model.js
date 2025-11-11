import orm from "../config/sequelize.js"
import { DataTypes } from "sequelize";

export const Categoria = orm.define('Categoria', {
    id_categ: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'categories',  // nombre en la BD
    timestamps: false,        // false Si no tienes createdAt/updatedAt
    underscored: true         // convierte nombres a snake_case, si faltara
});
