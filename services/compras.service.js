import { Compra, Curso, Usuario } from "../models/models.index.js";

// Obtener todas las compras con información del curso y usuario
export const serv_getAllPurchases = async () => {
    const purchases =  await Compra.findAll({
        where: { active: true },
        include: [
            { model: Curso, as: 'course', attributes: ['id_course', 'course_name', 'price'] },
            { model: Usuario, as: 'user', attributes: ['id_user', 'username', 'first_name', 'last_name'] }
        ]
    });
    if (!purchases) return null;

    // Mapear para añadir precio_final
    return purchases.map(purchase => {
        const compraData = purchase.toJSON(); // Convertimos a objeto plano
        const precioBase = Number(compraData.course.price);
        const dscto = Math.min(Math.max(compraData.dscto || 0, 0), 100);

        // Calculamos el precio final
        const precioFinal = precioBase - (precioBase * dscto / 100);

        return {
            ...compraData,
            final_price: parseFloat(precioFinal.toFixed(2)) // Redondeo a 2 decimales
        };
    });

};

// Obtener una compra por ID con información del curso y usuario
export const serv_getPurchaseById = async (id) => {
    const purchase = await Compra.findByPk(id, {
        where: { active: true },
        include: [
            { model: Curso, as: 'course', attributes: ['id_course', 'course_name', 'price'] },
            { model: Usuario, as: 'user', attributes: ['id_user', 'username', 'first_name', 'last_name'] }
        ]
    });
    if (!purchase) return null;
    const compraData = purchase.toJSON(); // Convertimos a objeto plano
    const precioBase = Number(compraData.course.price);
    const dscto = Math.min(Math.max(compraData.dscto || 0, 0), 100);
    const precioFinal = precioBase - (precioBase * dscto / 100);
    return {
        ...compraData,
        final_price: parseFloat(precioFinal.toFixed(2))
    }
};

// Crear una compra
export const serv_createPurchase = async (data) => {
    delete data.datetime_purchase;
    delete data.active;
    return await Compra.create(data);
};

// Actualizar una compra por ID
export const serv_updatePurchaseById = async (id, newData) => {
    delete newData.datetime_purchase;
    delete newData.active;
    const purchase = await Compra.findByPk(id);
    if (!purchase) return null;
    return await purchase.update(newData);
};

// Eliminar una compra por ID
export const serv_deletePurchaseById = async (id) => {
    const purchase = await Compra.findByPk(id);
    if (!purchase) return null;
    await purchase.update({ active: false });
    return purchase;
};
