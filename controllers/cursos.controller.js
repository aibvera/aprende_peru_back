import * as sCurso from "../services/cursos.service.js";
import { ValidationError, UniqueConstraintError } from "sequelize";

// Obtener todos los cursos (incluye categoría y nivel)
export const getAllCourses = async (req, res) => {
    try {
        const cursos = await sCurso.serv_getAllCourses();
        res.status(200).json(cursos);
    } catch (error) {
        console.error("Error en controlador getAllCourses:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener un curso por ID
export const getCourseById = async (req, res) => {
    try {

        // Validar que hay un id en la URL
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "No hay id en la URL" });
        }

        // Obtener curso desde la BD
        const curso = await sCurso.serv_getCourseById(id);

        // Validar que existe el curso
        if (!curso) {
            return res.status(404).json({ error: "Curso no encontrado" });
        }

        // Devolver el curso
        res.status(200).json(curso);

    } catch (error) {
        console.error("Error en controlador getCourseById:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Crear un curso
export const createCourse = async (req, res) => {
    try {
        const data = req.body;

        // Validar que el body existe
        if (!data) {
            return res.status(400).json({ error: "No hay body en la petición" });
        }

        // Validar campos obligatorios
        if (!data.course_name || !data.price || !data.id_categ || !data.id_level) {
            return res.status(400).json({ 
                error: "Faltan datos obligatorios (course_name, price, id_categ, id_level)" 
            });
        }

        // Validar precio
        if (isNaN(data.price) || Number(data.price) <= 0) {
            return res.status(400).json({ error: "El precio debe ser un número positivo" });
        }

        // Crear curso
        const newCourse = await sCurso.serv_createCourse(data);
        res.status(201).json(newCourse);

    } catch (error) {

        // Errores por validaciones de la BD
        if (error instanceof ValidationError) {
            return res.status(400).json({
                error: "Error de validación",
                detalles: error.errors.map(e => e.message)
            });
        }

        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({
                error: "Conflicto: valor duplicado en un campo único",
                detalles: error.errors.map(e => e.message)
            });
        }

        // Otros errores
        console.error("Error en controlador createCourse:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar un curso
export const updateCourse = async (req, res) => {
    try {

        // Validar que hay un id en la URL
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "No hay id en la URL" });
        }

        // Validar que haya, al menos, un campo para actualizar
        const newData = req.body;
        if (!newData || 
            (!newData.course_name && !newData.price && !newData.id_categ && !newData.id_level)) {
            return res.status(400).json({ error: "Falta algún campo para actualizar" });
        }

        // Validar que el precio (si se recibe precio) sea un número
        if (newData.price && (isNaN(newData.price) || Number(newData.price) <= 0)) {
            return res.status(400).json({ error: "El precio debe ser un número positivo" });
        }

        // Actualizar curso en la BD y avisar si no existe el curso
        const updatedCourse = await sCurso.serv_updateCourseById(id, newData);
        if (!updatedCourse) {
            return res.status(404).json({ error: "Curso no encontrado" });
        }

        // Devolver el curso actualizado
        res.status(200).json(updatedCourse);

    } catch (error) {

        // Errores por validación a nivel de BD
        if (error instanceof ValidationError) {
            return res.status(400).json({
                error: "Error de validación",
                detalles: error.errors.map(e => e.message)
            });
        }

        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({
                error: "Conflicto: valor duplicado en un campo único",
                detalles: error.errors.map(e => e.message)
            });
        }

        // Otros errores
        console.error("Error en controlador updateCourse:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Eliminar un curso
export const deleteCourse = async (req, res) => {
    try {

        // Validar que hay un ID
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "No hay id en la URL" });
        }

        // Eliminar curso y avisar si no se encontró
        const deletedCourse = await sCurso.serv_deleteCourseById(id);
        if (!deletedCourse) {
            return res.status(404).json({ error: "Curso no encontrado" });
        }

        // Devolver mensaje de éxito
        res.status(200).json({ message: "Curso eliminado con éxito" });

    } catch (error) {
        console.error("Error en controlador deleteCourse:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
