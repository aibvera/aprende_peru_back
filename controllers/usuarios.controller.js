import bcrypt from "bcrypt";
import { BCRYPT_ROUNDS } from "../config/env.js"
import * as sUsuario from "../services/usuarios.service.js";
import { ValidationError, UniqueConstraintError } from "sequelize";

// Devolver todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const usuarios = await sUsuario.serv_getAllUsers();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error en controlador getAllUsers:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Devolver un usuario específico por username
export const getUserByUsername = async (req, res) => {
    try {

        // Validar que hay username como parametro del request
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ error: "No hay username en la URL" });
        }

        // Consulta en base al parámetro
        const user = await sUsuario.serv_getUserByUsername(username);

        // Validar que se ha encontrado info en la BD
        if (!user || user.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Devolver el usuario
        res.status(200).json(user);

    } catch (error) {
        console.error("Error en controlador getUserByUsername:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Crear un usuario
export const createUser = async (req, res) => {
    try {

        // Validar data del body
        const data = req.body;
        if (!data) {
            return res.status(400).json({ error: "No hay body" });
        }
        if (!data.username || !data.password || !data.first_name || !data.last_name || !data.email) {
            return res.status(400).json({ error: "Faltan datos obligatorios (username, password, first_name, last_name, email)" });
        }

        // Validar contraseña
        if (data.password.length < 6 || data.password.length > 50) {
            return res.status(400).json({ error: "La contraseña debe tener entre 6 y 50 caracteres" });
        }

        // Encriptar la contraseña
        data.password = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

        // Añadir a la BD y devolver nuevo usuario
        const newUser = await sUsuario.serv_createUser(data);
        res.status(201).json(newUser);

    } catch (error) {

        // Validaciones personalizadas de Sequelize
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

        // Otro error
        console.error("Error en controlador createUser:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Editar info de un usuario
export const updateUser = async (req, res) => {
    try {

        // Validar data del URL y body
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "No hay id en la URL" });
        }
        const newData = req.body;
        if (!newData.username && !newData.password && !newData.first_name && !newData.last_name && !newData.email) {
            return res.status(400).json({ error: "Falta algún campo para actualizar" });
        }

        // Si se quiere actualizar la contraseña, encriptarla
        if (newData.password) {
            newData.password = await bcrypt.hash(newData.password, BCRYPT_ROUNDS);
        }

        // Actualizar si existe el usuario. Si no, devolver el error
        const updatedUser = await sUsuario.serv_updateUserById(id, newData);
        if (!updatedUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Devolver datos actualizados del usuario
        res.status(200).json(updatedUser);

    } catch (error) {

        // Validaciones personalizadas de Sequelize
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

        // Otro error
        console.error("Error en controlador updateUser:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {

        // Validar el id en el URL
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ error: "No hay id en la URL" });
        }

        // Eliminar el usuario. Si no existe, avisar
        const deletedUser = await sUsuario.serv_deleteUserById(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Devolver mensaje de exito
        res.status(200).json({ message: "Usuario eliminado con éxito" });

    } catch (error) {
        console.error("Error en controlador deleteUser:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
