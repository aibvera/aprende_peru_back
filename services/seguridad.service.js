import { Usuario } from "../models/models.index.js";
import bcrypt from "bcrypt";

// Login principal
export const serv_login = async (username, password) => {
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) return null;
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return null;
    return usuario;
};
