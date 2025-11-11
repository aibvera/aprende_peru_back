import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Aprende Perú API",
            version: "1.0"
        },
        servers: [
            {
                url: `http://localhost:${process.env.APP_PORT}/api`
            }
        ]
    },
    apis: [path.join(__dirname, "../routes/*.js")]
};

export default swaggerJSDoc(options);
