import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRES, JWT_REFRESH, JWT_REFRESH_EXPIRES } from './env.js';

// Generar un access token
export const generateAccessToken = function (payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// Generar refresh token
export const generateRefreshToken = function (payload) {
    return jwt.sign(payload, JWT_REFRESH, { expiresIn: JWT_REFRESH_EXPIRES });
}

// Verificar access token
export const verifyAccessToken = function (token) {
    return jwt.verify(token, JWT_SECRET);
}

// Verificar refresh token
export const verifyRefreshToken = function (token) {
    return jwt.verify(token, JWT_REFRESH);
}
