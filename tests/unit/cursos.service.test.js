import { jest } from "@jest/globals";

// --- MOCK DE MODELOS (antes de importar el servicio real)
jest.unstable_mockModule("../../models/models.index.js", () => ({
    Curso: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
    Categoria: {
        findByPk: jest.fn(),
    },
    Nivel: {
        findByPk: jest.fn(),
    },
}));

// --- IMPORTAR LOS MÓDULOS MOCKEADOS Y SERVICIOS ---
const { Curso } = await import("../../models/models.index.js");
const {
    serv_getAllCourses,
    serv_getCourseById,
    serv_createCourse,
    serv_updateCourseById,
    serv_deleteCourseById,
} = await import("../../services/cursos.service.js");

// --- BLOQUE DE TESTS ---
describe("🧠 Servicio de Cursos (unit)", () => {
    beforeEach(() => jest.clearAllMocks());
    afterEach(() => jest.clearAllMocks());

    // ====================================================
    // CREAR CURSO
    // ====================================================
    test("Crea un curso correctamente", async () => {
        const mockData = { course_name: "Testing en node", id_categ: 1, id_level: 2, price: 12 };
        Curso.create.mockResolvedValue(mockData);

        const result = await serv_createCourse(mockData);

        expect(Curso.create).toHaveBeenCalledWith(mockData);
        expect(result.course_name).toBe("Testing en node");
        expect(result.price).toBe(12);
    });

    // ====================================================
    // OBTENER CURSO POR ID
    // ====================================================
    test("Devuelve un curso existente por ID", async () => {
        const mockCourse = { id_course: 1, course_name: "Curso mockeado", id_categ: 1, id_level: 2, price: 10 };
        Curso.findByPk.mockResolvedValue(mockCourse);

        const result = await serv_getCourseById(1);

        expect(Curso.findByPk).toHaveBeenCalledWith(1, expect.objectContaining({
            include: expect.any(Array),
        }));
        expect(result.course_name).toBe("Curso mockeado");
    });

    test("Devuelve null si el curso no existe", async () => {
        Curso.findByPk.mockResolvedValue(null);

        const result = await serv_getCourseById(999);

        expect(Curso.findByPk).toHaveBeenCalledWith(999, expect.any(Object));
        expect(result).toBeNull();
    });

    // ====================================================
    // OBTENER TODOS LOS CURSOS
    // ====================================================
    test("Devuelve la lista completa de cursos", async () => {
        const mockCourses = [
            { id_course: 1, course_name: "Node avanzado" },
            { id_course: 2, course_name: "Python básico" },
        ];
        Curso.findAll.mockResolvedValue(mockCourses);

        const result = await serv_getAllCourses();

        expect(Curso.findAll).toHaveBeenCalledWith(expect.objectContaining({
            include: expect.any(Array),
        }));
        expect(result).toHaveLength(2);
        expect(result[0].course_name).toBe("Node avanzado");
    });

    test("Devuelve un arreglo vacío si no hay cursos", async () => {
        Curso.findAll.mockResolvedValue([]);

        const result = await serv_getAllCourses();

        expect(result).toEqual([]);
    });

    // ====================================================
    // ACTUALIZAR CURSO
    // ====================================================
    test("Actualiza un curso existente", async () => {
        const mockCourse = {
            id_course: 1,
            course_name: "Curso viejo",
            update: jest.fn().mockResolvedValue({
                id_course: 1,
                course_name: "Curso nuevo",
            }),
        };
        Curso.findByPk.mockResolvedValue(mockCourse);

        const result = await serv_updateCourseById(1, { course_name: "Curso nuevo" });

        expect(Curso.findByPk).toHaveBeenCalledWith(1);
        expect(mockCourse.update).toHaveBeenCalledWith({ course_name: "Curso nuevo" });
        expect(result.course_name).toBe("Curso nuevo");
    });

    test("Devuelve null al intentar actualizar un curso inexistente", async () => {
        Curso.findByPk.mockResolvedValue(null);

        const result = await serv_updateCourseById(999, { course_name: "Nada" });

        expect(result).toBeNull();
    });

    // ====================================================
    // ELIMINAR CURSO
    // ====================================================
    test("Elimina un curso existente", async () => {
        const mockCourse = {
            id_course: 10,
            destroy: jest.fn().mockResolvedValue(),
        };
        Curso.findByPk.mockResolvedValue(mockCourse);

        const result = await serv_deleteCourseById(10);

        expect(Curso.findByPk).toHaveBeenCalledWith(10);
        expect(mockCourse.destroy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockCourse);
    });

    test("Devuelve null al intentar eliminar un curso inexistente", async () => {
        Curso.findByPk.mockResolvedValue(null);

        const result = await serv_deleteCourseById(404);

        expect(result).toBeNull();
    });
});
