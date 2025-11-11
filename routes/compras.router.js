import express from "express";
import * as cCompra from "../controllers/compras.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Rutas de compras

/**
 * @swagger
 * tags:
 *   name: Compras
 *   description: Operaciones CRUD relacionadas a compras
 */


/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Obtener todos las compras
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de compras
 */
router.get("/", authMiddleware, cCompra.getAllPurchases);


/**
 * @swagger
 * /compras/{id}:
 *   get:
 *     summary: Obtener compra por ID
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Devuelve los datos de una compra específica
 */
router.get("/id/:id", authMiddleware, cCompra.getPurchaseById);


/**
 * @swagger
 * /compras/add:
 *   post:
 *     summary: Crear una nueva compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_course
 *               - id_user
 *               - id_discount
 *             properties:
 *               id_course:
 *                 type: integer
 *               id_user:
 *                 type: integer
 *               id_discount:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Compra creada exitosamente
 *       400:
 *         description: Datos inválidos o incompletos
 */
router.post("/add", authMiddleware, cCompra.createPurchase);


/**
 * @swagger
 * /compras/{id}:
 *   patch:
 *     summary: Actualizar algún campo de una compra existente. Es necesario recibir, al menos, un campo a actualizar.
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la compra a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_course:
 *                 type: integer
 *               id_user:
 *                 type: integer
 *               id_discount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Compra actualizada exitosamente
 *       404:
 *         description: Compra no encontrada
 */
router.patch("/:id", authMiddleware, cCompra.updatePurchase);


/**
 * @swagger
 * /compras/{id}:
 *   delete:
 *     summary: Eliminar lógicamente una compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la compra a eliminar
 *     responses:
 *       200:
 *         description: Compras eliminada exitosamente
 *       404:
 *         description: Compra no encontrada
 */
router.delete("/:id", authMiddleware, cCompra.deletePurchase);

// Ejecución de procedimiento almacenado
// router.get("/ventas_mensuales", authMiddleware, cCompra.getMonthlySales);

export default router;
