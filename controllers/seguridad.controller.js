import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../config/jwt.js"
import * as sSeguridad from "../services/seguridad.service.js";

// Función de logeo
export const login = async (req, res) => {
    const { username, password } = req.body;

    // Validación de campos entrantes
    if (!username || !password) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    try {

        // Servicio de logeo
        const user = await sSeguridad.serv_login(username, password);

        // Validar que se ha encontrado al usuario en la BD
        if (!user || user.length === 0) {
            return res.status(404).json({ error: "Credenciales inválidas" });
        }

        // Generar token y devolver
        const tokenPayload = {
            id: user.id_user,
            username: user.username,
            nombre: user.first_name,
            apellido: user.last_name,
            correo: user.email,
            role: user.role
        };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);
        res.status(200).json({ accessToken, refreshToken, user: tokenPayload });

    } catch (error) {
        console.error("Error en login controller:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar access Token con el refresh Token
export const refreshAccessToken = async (req, res) => {

    // Obtener token del request
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Espera formato: "Bearer token"
    if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    try {

        // Validar refreshToken
        const decoded = verifyRefreshToken(token);
        if (!decoded) {
            return res.status(403).json({ error: "Refresh token inválido o expirado" });
        }

        // Devolver accessToken actualizado
        const tokenPayload = {
            id: decoded.id,
            username: decoded.username,
            nombre: decoded.first_name,
            apellido: decoded.last_name,
            correo: decoded.email,
            role: decoded.role
        };
        const newAccess = generateAccessToken(tokenPayload);
        res.status(200).json({ newAccess, oldRefreshToken, user: tokenPayload });

    } catch (error) {
        console.error("Error en controlador de seguridad refreshAccessToken:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
