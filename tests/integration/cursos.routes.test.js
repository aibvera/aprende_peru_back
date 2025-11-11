import { jest } from "@jest/globals";
import request from "supertest";

// Mock del middleware de autenticación (para no requerir JWT real)
jest.unstable_mockModule("../../middleware/auth.js", () => ({
    authMiddleware: (req, res, next) => next(),
}));

const { default: app } = await import("../../server.js");
const { default: orm } = await import("../../config/sequelize.js");
const { Curso, Categoria, Nivel } = await import("../../models/models.index.js");

// Ruta base
const route = "/api/cursos";

describe("API de Cursos (integration)", () => {

    beforeAll(async () => {
        // Sincroniza la BD limpia antes de las pruebas
        await orm.sync({ force: true, alter: true });

        // Crea datos base (requeridos por FK)
        await Categoria.create({ category: "Programación" });
        await Nivel.create({ level: "Básico" });

        // Crea un curso inicial
        await Curso.create({
            course_name: "Node.js desde cero",
            price: 120.00,
            id_categ: 1,
            id_level: 1
        });
    });

    afterAll(async () => {
        // Cierra la conexión con la base de datos después de las pruebas
        await orm.close();
    });

    // ==========================================================
    // GET /api/cursos
    // ==========================================================
    test("GET /api/cursos debe devolver todos los cursos", async () => {
        const res = await request(app).get(route+'/');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("course_name", "Node.js desde cero");
    });

    // ==========================================================
    // GET /api/cursos/:id
    // ==========================================================
    test("GET /api/cursos/:id debe devolver un curso existente", async () => {
        const res = await request(app).get(`${route}/1`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("course_name", "Node.js desde cero");
    });

    // ==========================================================
    // POST /api/cursos/add
    // ==========================================================
    test("POST /api/cursos/add debe crear un curso válido", async () => {
        const newCourse = {
            course_name: "React avanzado",
            price: 200.00,
            id_categ: 1,
            id_level: 1
        };

        const res = await request(app)
            .post(`${route}/add`)
            .send(newCourse)
            .set("Content-Type", "application/json");

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id_course");
        expect(res.body.course_name).toBe("React avanzado");
    });

    test("POST /api/cursos/add debe fallar si falta el precio", async () => {
        const res = await request(app)
            .post(`${route}/add`)
            .send({
                course_name: "Django intermedio",
                id_categ: 1,
                id_level: 1
            })
            .set("Content-Type", "application/json");

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/price/i);
    });

    // ==========================================================
    // PATCH /api/cursos/:id
    // ==========================================================
    test("PATCH /api/cursos/:id debe actualizar el precio correctamente", async () => {
        const res = await request(app)
            .patch(`${route}/1`)
            .send({ price: 180.00 })
            .set("Content-Type", "application/json");

        expect(res.statusCode).toBe(200);
        expect(res.body.price).toBe(180.00);
    });

    test("PATCH /api/cursos/:id debe fallar si el curso no existe", async () => {
        const res = await request(app)
            .patch(`${route}/999`)
            .send({ price: 99.00 })
            .set("Content-Type", "application/json");

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toMatch(/no encontrado/i);
    });

    // ==========================================================
    // DELETE /api/cursos/:id
    // ==========================================================
    test("DELETE /api/cursos/:id debe eliminar un curso existente", async () => {
        const res = await request(app).delete(`${route}/1`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/eliminado/i);
    });

    test("DELETE /api/cursos/:id debe fallar si el curso no existe", async () => {
        const res = await request(app).delete(`${route}/999`);
        expect(res.statusCode).toBe(404);
    });

});
