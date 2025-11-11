import { Usuario } from "../models/models.index.js";

// Obtener todos los usuarios
export const serv_getAllUsers = async () => {
    return await Usuario.findAll({
        attributes: { exclude: ['password'] }
    });
};

// Obtener usuario por username
export const serv_getUserByUsername = async (username) => {
    return await Usuario.findOne({
        where: { username },
        attributes: { exclude: ["password"] }
    });
};

// Obtener usuario por id
export const serv_getUserById = async (id) => {
    return await Usuario.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
};

// Crear un usuario y devolverlo sin contraseña
export const serv_createUser = async (data) => {
    const user = await Usuario.create(data);
    const { password, ...userWithoutPassword } = user.get({ plain: true });
    return userWithoutPassword;
};

// Actualizar datos de un usuario
export const serv_updateUserById = async (id, newData) => {
    const user = await Usuario.findByPk(id);
    if (!user) return null;
    await user.update(newData);
    const { password, ...userWithoutPassword } = user.get({ plain: true });
    return userWithoutPassword;
};

// Eliminar un usuario por ID
export const serv_deleteUserById = async (id) => {
    const user = await Usuario.findByPk(id);
    if (!user) return null;
    await user.destroy();
    const { password, ...userWithoutPassword } = user.get({ plain: true });
    return userWithoutPassword; // opcional
};
