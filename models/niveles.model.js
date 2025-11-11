import orm from "../config/sequelize.js"
import { DataTypes } from "sequelize";

export const Nivel = orm.define('Nivel', {
    id_level: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    level: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'levels',  // nombre en la BD
    timestamps: false,    // false Si no tienes createdAt/updatedAt
    underscored: true     // convierte nombres a snake_case, si faltara
});
