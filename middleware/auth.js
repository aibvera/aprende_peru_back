import { verifyAccessToken } from "../config/jwt.js";

// Middleware de autenticación de access JWT
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token requerido" });

    try {
        const user = verifyAccessToken(token);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};
