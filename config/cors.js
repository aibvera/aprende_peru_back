import cors from "cors";
import { ALLOWED_ORIGINS } from "./env.js";

export const buildCorsConfig = () => {

    return cors({
        origin: (origin, callback) => {
            // Permite solicitudes sin origin (como Postman) o si está en la lista
            if (!origin || ALLOWED_ORIGINS.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    });

};
