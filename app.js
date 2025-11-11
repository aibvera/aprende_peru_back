import app from "./server.js";
import { APP_PORT } from "./config/env.js";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { runSeeds } from "./config/seed.js";
import orm from "./config/sequelize.js";

const PUERTO = APP_PORT || 3000;

// Documentación
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Arrancar servidor
(async () => {
    try {

        // Conectar a la BD y sincronizar datos
        await orm.sync({ alter: true, force: true});
        console.log("✅ Tablas creadas/sincronizadas con éxito");

        // Ejecuta seeds
        await runSeeds();

        // Arrancar
        app.listen(PUERTO, () => {
            console.log("🚀 Servidor corriendo en puerto " + PUERTO);
        });

    } catch (error) {
        console.error("❌ Error en app.js:", error);
    }
})();
