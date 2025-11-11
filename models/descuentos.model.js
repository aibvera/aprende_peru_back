import orm from "../config/sequelize.js"
import { DataTypes } from "sequelize";

export const Descuento = orm.define('Descuento', {
    id_discount: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    discount_pct: {
        type: DataTypes.DECIMAL(3, 2),  // Ej.: 0.35
        allowNull: false
    }
}, {
    tableName: 'discounts',  // nombre en la BD
    timestamps: false,       // false Si no tienes createdAt/updatedAt
    underscored: true        // convierte nombres a snake_case, si faltara
});
