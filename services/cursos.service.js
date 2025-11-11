import { Curso, Categoria, Nivel } from "../models/models.index.js";

// Obtener todos los cursos con categoría y nivel
export const serv_getAllCourses = async () => {
    return await Curso.findAll({
        include: [
            { model: Categoria, as: 'category', attributes: ['id_categ', 'category'] },
            { model: Nivel, as: 'level', attributes: ['id_level', 'level'] }
        ]
    });
};

// Obtener curso por ID con categoría y nivel
export const serv_getCourseById = async (id) => {
    return await Curso.findByPk(id, {
        include: [
            { model: Categoria, as: 'category', attributes: ['id_categ', 'category'] },
            { model: Nivel, as: 'level', attributes: ['id_level', 'level'] }
        ]
    });
};

// Crear un curso
export const serv_createCourse = async (data) => {
    return await Curso.create(data);
};

// Actualizar curso por ID
export const serv_updateCourseById = async (id, newData) => {
    const course = await Curso.findByPk(id);
    if (!course) return null;
    return await course.update(newData);
};

// Eliminar un curso por ID
export const serv_deleteCourseById = async (id) => {
    const course = await Curso.findByPk(id);
    if (!course) return null;
    await course.destroy();
    return course; // opcional: devolver el curso eliminado
};
