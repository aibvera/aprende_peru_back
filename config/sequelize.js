import { Sequelize } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } from "../config/env.js"

// Parámetros de conexión a la BD
const orm = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    timezone: '+00:00', // fuerza UTC en las queries INSERT/UPDATE
    logging: false,
});

// Comprobar conexión (1 sola vez)
(async () => {
    try {
        await orm.authenticate();
        console.log("✅ Conexión establecida (ORM)");
    } catch (error) {
        console.error("❌ Error al conectar (ORM):", error);
    }
})();

export default orm;
