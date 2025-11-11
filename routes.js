import express from "express";
import rCursos from "./routes/cursos.router.js";
import rUsuarios from "./routes/usuarios.router.js";
import rCompras from "./routes/compras.router.js";
import rSeguridad from "./routes/seguridad.router.js";

const router = express.Router();

// Rutas generales
router.use("/cursos", rCursos);
router.use("/usuarios", rUsuarios);
router.use("/compras", rCompras);
router.use("/seguridad", rSeguridad);

export default router;
