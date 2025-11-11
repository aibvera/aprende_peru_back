import orm from "../config/sequelize.js"
import { DataTypes } from "sequelize";

export const Curso = orm.define('Curso', {
    id_course: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    course_name: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    id_categ: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categories',  // nombre de la tabla relacionada
            key: 'id_categ'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    id_level: {
        type: DataTypes.INTEGER,
        references: {
            model: 'levels',
            key: 'id_level'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    price: {
        type: DataTypes.DECIMAL(6, 2),  // Ej.: 1593.99
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    image_path: {
        type: DataTypes.STRING(255), // Ej: 'uploads/cursos/foto_curso.jpg'
        allowNull: true
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'courses',  // nombre en la BD
    timestamps: false,     // false Si no tienes createdAt/updatedAt
    underscored: true      // convierte nombres a snake_case, si faltara
});
