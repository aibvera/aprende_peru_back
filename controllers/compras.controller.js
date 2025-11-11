import * as sCompras from "../services/compras.service.js";
import { ValidationError, UniqueConstraintError } from "sequelize";
import { formatPurchaseDates } from "../utils/dateConversion.js"

// Obtener todas las compras (incluye usuario y curso)
export const getAllPurchases = async (req, res) => {
    try {
        const timezone = req.headers["accept-timezone"] || "America/Lima";
        const purchases = await sCompras.serv_getAllPurchases();
        const formattedPurchases = formatPurchaseDates(purchases, timezone);  // Convertir a hora del header
        return res.status(200).json(formattedPurchases);
    } catch (error) {
        console.error("Error en controlador getAllPurchases:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener una compra por ID
export const getPurchaseById = async (req, res) => {
    try {

        // Validar que hay un ID en la URL
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "No hay id en la URL" });
        }
        const timezone = req.headers["accept-timezone"] || "America/Lima";

        // Buscar compra en la BD
        const purchase = await sCompras.serv_getPurchaseById(id);

        // Validar existencia
        if (!purchase) {
            return res.status(404).json({ error: "Compra no encontrada" });
        }

        // Convertir fechaHora de UTC a la del header
        const formattedPurchase = formatPurchaseDates(purchase, timezone);

        // Devolver compra encontrada
        return res.status(200).json(formattedPurchase);

    } catch (error) {
        console.error("Error en controlador getPurchaseById:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Crear una compra
export const createPurchase = async (req, res) => {
    try {
        const data = req.body;

        // Validar que hay body
        if (!data) {
            return res.status(400).json({ error: "No hay body en la petición" });
        }

        // Validar campos obligatorios
        if (!data.id_user || !data.id_course || data.discount==null) {
            return res.status(400).json({ 
                error: "Faltan datos obligatorios (id_user, id_course, discount)" 
            });
        }

        // Crear compra
        const newPurchase = await sCompras.serv_createPurchase(data);
        const formattedPurchase = formatPurchaseDates(newPurchase);
        return res.status(201).json(formattedPurchase);

    } catch (error) {

        // Errores por validación de Sequelize
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
        console.error("Error en controlador createPurchase:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar una compra
export const updatePurchase = async (req, res) => {
    try {
        // Validar que hay un ID en la URL
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "No hay id en la URL" });
        }

        // Validar que hay datos para actualizar
        const newData = req.body;
        if (
            !newData || 
            (!newData.id_user && !newData.id_course && !newData.discount)
        ) {
            return res.status(400).json({ error: "Falta algún campo para actualizar" });
        }

        // Actualizar compra y avisar si no existe la compra
        const updatedPurchase = await sCompras.serv_updatePurchaseById(id, newData);
        if (!updatedPurchase) {
            return res.status(404).json({ error: "Compra no encontrada" });
        }
        const formattedPurchase = formatPurchaseDates(updatedPurchase);

        // Devolver compra actualizada
        return res.status(200).json(formattedPurchase);

    } catch (error) {

        // Errores por validación en BD
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
        console.error("Error en controlador updatePurchase:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Eliminar una compra
export const deletePurchase = async (req, res) => {
    try {
        // Validar que hay un ID
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "No hay id en la URL" });
        }

        // Eliminar compra y validar que exista
        const deletedPurchase = await sCompras.serv_deletePurchaseById(id);
        if (!deletedPurchase) {
            return res.status(404).json({ error: "Compra no encontrada" });
        }

        // Devolver mensaje de éxito
        return res.status(200).json({ message: "Compra eliminada con éxito" });

    } catch (error) {
        console.error("Error en controlador deletePurchase:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Reporte de ventas mensuales
export const getMonthlySales = async (req, res) => {
    try {

        // Validar parámetros
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Faltan parámetros fecha de inicio y de fin" })
        }

        // Llamar al servicio que llama al SP
        const data = await sCompras.serv_getMonthlySales(startDate, endDate);

        // Avisar que no hay compras o devolver data
        if (!data || data.length === 0) {
            return res.json({ message: "No hay compras" })
        }
        return res.json(data);

    } catch (error) {
        console.error("Error en controlador getMonthlySales:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};
