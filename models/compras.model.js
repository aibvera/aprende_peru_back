import orm from "../config/sequelize.js";
import { DataTypes } from "sequelize";

export const Compra = orm.define('Compra', {
    id_purchase: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    datetime_purchase: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',  // nombre de la tabla relacionada
            key: 'id_user'
        },
        onUpdate: 'CASCADE',
        allowNull: true,
        onDelete: 'SET NULL'
    },
    id_course: {
        type: DataTypes.INTEGER,
        references: {
            model: 'courses',
            key: 'id_course'
        },
        onUpdate: 'CASCADE',
        allowNull: true,
        onDelete: 'SET NULL'
    },
    id_discount: {
        type: DataTypes.INTEGER,
        references: {
            model: 'discounts',
            key: 'id_discount'
        },
        onUpdate: 'CASCADE',
        allowNull: true,
        onDelete: 'SET NULL'
    }
}, {
    tableName: 'purchases',
    timestamps: false,
    underscored: true
});
