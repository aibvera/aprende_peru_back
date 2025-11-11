import { DateTime } from "luxon";

/**
 * Convierte las fechas datetime_purchase de UTC a la zona horaria indicada
 * @param {Object|Array} data - Objeto o array con compras
 * @param {string} timezone - Zona horaria en formato IANA (ej: "America/Lima")
 * @returns {Object|Array} - Objeto/array con fechas convertidas
 */
export const formatPurchaseDates = (data, timezone = "UTC") => {

    // Subfunción para convertir
    const formatDate = (utcDate) => {
        return DateTime.fromJSDate(utcDate, { zone: "utc" })
            .setZone(timezone)
            .toFormat("yyyy-MM-dd HH:mm:ss");
    };

    /// Conversión de acuerdo al tipo de data entrante
    if (Array.isArray(data)) {
        return data.map(item => {
            const plain = typeof item.toJSON === "function" ? item.toJSON() : item;
            return {
                ...plain,
                datetime_purchase: formatDate(plain.datetime_purchase)
            };
        });
    } else if (data && typeof data === "object") {
        const plain = typeof data.toJSON === "function" ? data.toJSON() : data;
        return {
            ...plain,
            datetime_purchase: formatDate(plain.datetime_purchase)
        };
    }
    return data;
};
