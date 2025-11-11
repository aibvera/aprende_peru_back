import express from "express";
import * as cSeguridad from "../controllers/seguridad.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Rutas de seguridad

/**
 * @swagger
 * tags:
 *   name: Seguridad
 *   description: Login y refresh Access Token
 */


/**
 * @swagger
 * /seguridad/login:
 *   post:
 *     summary: Validar UN y PW y devolver tokens y payload básico
 *     tags: [Seguridad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Devuelve un nuevo Access y Refresh Tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Nuevo Access Token generado
 *                 refreshToken:
 *                   type: string
 *                   description: Nuevo Refresh Token generado
 *                 payload:
 *                   type: object
 *                   description: Información decodificada del usuario
 *       400:
 *         description: Datos inválidos o incompletos.
 */
router.post("/login", cSeguridad.login);


/**
 * @swagger
 * /seguridad/refresh_token:
 *   get:
 *     summary: Genera un nuevo Access Token a partir de un Refresh Token válido
 *     tags: [Seguridad]
 *     security:
 *       - bearerAuth (refresh token): []  # Indica que se debe enviar el token en el header Authorization
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer <refresh_token>"
 *         required: true
 *         description: Refresh Token válido
 *     responses:
 *       200:
 *         description: Devuelve un nuevo Access Token y el Refresh Token actual, en base al Refresh Token actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Nuevo Access Token generado
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh Token actual
 *                 payload:
 *                   type: object
 *                   description: Información decodificada del usuario
 *       401:
 *         description: Refresh Token no enviado o inválido
 */

router.get("/refresh_token", cSeguridad.refreshAccessToken);

export default router;
