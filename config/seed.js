import { Categoria } from "../models/categorias.model.js";
import { Nivel } from "../models/niveles.model.js";
import { Descuento } from "../models/descuentos.model.js";
import { Usuario } from "../models/usuarios.model.js";
import { Curso } from "../models/cursos.model.js";
import bcrypt from "bcrypt";
import { BCRYPT_ROUNDS } from "./env.js";

export async function runSeeds() {
    try {
        // Datos iniciales
        const categories = [
            { category: "Programación" },
            { category: "Diseño" },
            { category: "Marketing" },
            { category: "Manualidades"},
            { category: "Arte"},
        ];

        const levels = [
            { level: "Básico" },
            { level: "Intermedio" },
            { level: "Avanzado" },
        ];

        const discounts = [
            { name: "Sin descuento", discount_pct: 0 },
            { name: "10% OFF", discount_pct: 0.1 },
            { name: "20% OFF", discount_pct: 0.2 },
        ];

        const hashedPassword = await bcrypt.hash("123456", BCRYPT_ROUNDS);
        const users = [
            { username: "abueno", password: hashedPassword, first_name: "Alejandro", last_name: "Bueno", email: "abueno@gmail.com", role: "admin" },
            { username: "mcolonia", password: hashedPassword, first_name: "Mauricio", last_name: "Colonia", email: "mcolonia@gmail.com", role: "admin" },
        ];

        const courses = [
        {
            course_name: "Carpintería casera",
            id_categ: 4,
            id_level: 1,
            price: 215,
            duration: 8,
            image_path: "/img/carpinteria.jpg",
            detail: "Aprende a construir muebles y objetos útiles desde casa con herramientas básicas y técnicas seguras.",
        },
        {
            course_name: "Baile contemporáneo",
            id_categ: 5,
            id_level: 2,
            price: 320,
            duration: 20,
            image_path: "/img/danza_cont.jpeg",
            detail: "Descubre la libertad del movimiento y desarrolla tu expresión corporal a través del baile contemporáneo.",
        },
        {
            course_name: "Fotografía digital",
            id_categ: 5,
            id_level: 1,
            price: 280,
            duration: 15,
            image_path: "/img/fotografia.jpg",
            detail: "Domina tu cámara y aprende a capturar imágenes impresionantes con técnicas básicas de composición y luz.",
        },
        {
            course_name: "Machine Learning",
            id_categ: 1,
            id_level: 3,
            price: 200,
            duration: 12,
            image_path: "/img/machineLearning.jpg",
            detail: "Adéntrate en el mundo del aprendizaje automático y crea tus primeros modelos predictivos con Python.",
        },
        {
            course_name: "Cocina fusión peruana",
            id_categ: 4,
            id_level: 3,
            price: 450,
            duration: 25,
            image_path: "/img/cocinaFusion.jpg",
            detail: "Explora sabores únicos combinando técnicas peruanas y cocina internacional en recetas innovadoras y deliciosas.",
        },
        {
            course_name: "Introducción a la economía",
            id_categ: 3,
            id_level: 1,
            price: 230,
            duration: 10,
            image_path: "/img/introEconomia.jpeg",
            detail: "Comprende cómo funcionan los mercados, el dinero y las decisiones económicas en la vida cotidiana.",
        },
        {
            course_name: "Astronomía amateur",
            id_categ: 4,
            id_level: 1,
            price: 180,
            duration: 12,
            image_path: "/img/astronomiaAmateur.jpg",
            detail: "Descubre los secretos del universo y aprende a observar el cielo con telescopio o a simple vista.",
        },
        {
            course_name: "Ilustración digital con tablet",
            id_categ: 2,
            id_level: 2,
            price: 220,
            duration: 18,
            image_path: "/img/ilustracionTablet.jpg",
            detail: "Crea ilustraciones digitales sorprendentes usando tu tablet y desarrolla tu estilo artístico personal.",
        },
        {
            course_name: "Barismo creativo",
            id_categ: 5,
            id_level: 1,
            price: 160,
            duration: 8,
            image_path: "/img/barismoCreativo.jpeg",
            detail: "Aprende a preparar cafés perfectos, dominar la espuma y experimentar con arte latte y sabores.",
        },
        {
            course_name: "Escritura de ciencia ficción",
            id_categ: 5,
            id_level: 3,
            price: 290,
            duration: 20,
            image_path: "/img/escrituraCiencia.jpg",
            detail: "Desarrolla tu imaginación y aprende a construir mundos, personajes e historias de ciencia ficción envolventes.",
        },
        ];

        // Inserta solo si está vacío
        if (await Categoria.count() === 0) await Categoria.bulkCreate(categories);
        if (await Nivel.count() === 0) await Nivel.bulkCreate(levels);
        if (await Descuento.count() === 0) await Descuento.bulkCreate(discounts);
        if (await Usuario.count() === 0) await Usuario.bulkCreate(users);
        if (await Curso.count() === 0) await Curso.bulkCreate(courses);
        console.log("✅ Datos sincronizados")

    } catch (error) {
        console.error("❌ Error en seeds:", error);
    }
}
