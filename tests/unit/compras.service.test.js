import { jest } from "@jest/globals";

// --- MOCK DE MODELOS (antes de importar el servicio real)
jest.unstable_mockModule("../../models/models.index.js", () => ({
    Compra: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
    Curso: {},
    Usuario: {},
}));

// --- IMPORTAR LOS MÓDULOS MOCKEADOS Y SERVICIO ---
const { Compra } = await import("../../models/models.index.js");
const {
    serv_getAllPurchases,
    serv_getPurchaseById,
    serv_createPurchase,
    serv_updatePurchaseById,
    serv_deletePurchaseById,
} = await import("../../services/compras.service.js");

describe("Servicio de compras", () => {
    beforeEach(() => jest.clearAllMocks());

    // ====================================================
    // TODAS LAS COMPRAS
    // ====================================================
    test("Obtener todas las compras activas con cálculo de precio final", async () => {
        const mockPurchases = [
            {
                toJSON: () => ({
                    id_purchase: 1,
                    dscto: 20,
                    course: { id_course: 1, course_name: "React Avanzado", price: "100" },
                    user: { id_user: 10, username: "bertasa" },
                }),
            },
            {
                toJSON: () => ({
                    id_purchase: 2,
                    dscto: 0,
                    course: { id_course: 2, course_name: "Node.js", price: "80" },
                    user: { id_user: 11, username: "juanperez" },
                }),
            },
        ];

        Compra.findAll.mockResolvedValue(mockPurchases);

        const result = await serv_getAllPurchases();

        expect(Compra.findAll).toHaveBeenCalledWith({
            where: { active: true },
            include: expect.any(Array),
        });
        expect(result).toHaveLength(2);
        expect(result[0].final_price).toBe(80); // 20% de descuento sobre 100
        expect(result[1].final_price).toBe(80); // sin descuento
    });

    test("Calcula correctamente el precio final cuando el dscto está fuera de rango", async () => {
        const mockPurchases = [
            {
                toJSON: () => ({
                    id_purchase: 10,
                    dscto: -20, // descuento negativo → debe ser 0
                    course: { price: 100 },
                    user: { username: "usuario1" },
                }),
            },
            {
                toJSON: () => ({
                    id_purchase: 11,
                    dscto: 150, // descuento mayor a 100 → debe limitarse a 100
                    course: { price: 200 },
                    user: { username: "usuario2" },
                }),
            },
        ];
        Compra.findAll.mockResolvedValue(mockPurchases);

        const result = await serv_getAllPurchases();

        // Descuento -20 se convierte en 0 → precio final = 100
        expect(result[0].final_price).toBe(100);
        // Descuento 150 se limita a 100 → precio final = 0
        expect(result[1].final_price).toBe(0);
    });

    test("Calcula correctamente el precio final cuando no hay dscto definido", async () => {
        const mockPurchases = [
            {
                toJSON: () => ({
                    id_purchase: 20,
                    // no hay campo dscto
                    course: { price: 50 },
                    user: { username: "usuario3" },
                }),
            },
        ];
        Compra.findAll.mockResolvedValue(mockPurchases);

        const result = await serv_getAllPurchases();

        expect(result[0].final_price).toBe(50);
    });

    test("Obtener todas las compras devuelve null si no hay resultados", async () => {
        Compra.findAll.mockResolvedValue(null);

        const result = await serv_getAllPurchases();

        expect(result).toBeNull();
    });

    // ====================================================
    // COMPRA POR ID
    // ====================================================
    test("Obtener una compra por ID calcula correctamente el precio final", async () => {
        const mockPurchase = {
            toJSON: () => ({
                id_purchase: 1,
                dscto: 10,
                course: { id_course: 1, course_name: "Python", price: "50" },
                user: { id_user: 5, username: "berta" },
            }),
        };

        Compra.findByPk.mockResolvedValue(mockPurchase);

        const result = await serv_getPurchaseById(1);

        expect(Compra.findByPk).toHaveBeenCalledWith(1, expect.objectContaining({
            include: expect.any(Array),
        }));
        expect(result.final_price).toBe(45); // 10% descuento sobre 50
        expect(result.course.course_name).toBe("Python");
    });

    test("Calcula correctamente el precio final de un curso con dscto fuera de rango", async () => {
        // Caso 1: dscto negativo → debe ajustarse a 0
        const mockPurchaseNeg = {
            toJSON: () => ({
                id_purchase: 1,
                dscto: -30,
                course: { price: 100 },
                user: { username: "user1" },
            }),
        };

        // Caso 2: dscto mayor que 100 → debe ajustarse a 100
        const mockPurchaseOver = {
            toJSON: () => ({
                id_purchase: 2,
                dscto: 150,
                course: { price: 200 },
                user: { username: "user2" },
            }),
        };
        Compra.findByPk
            .mockResolvedValueOnce(mockPurchaseNeg)
            .mockResolvedValueOnce(mockPurchaseOver);

        const resultNeg = await serv_getPurchaseById(1);
        const resultOver = await serv_getPurchaseById(2);

        expect(resultNeg.final_price).toBe(100); // descuento -30 → 0%
        expect(resultOver.final_price).toBe(0);  // descuento 150 → 100%
    });

    test("Calcula correctamente el precio final de un curso cuando dscto es null", async () => {
        const mockPurchaseNull = {
            toJSON: () => ({
                id_purchase: 3,
                dscto: null,
                course: { price: 80 },
                user: { username: "user3" },
            }),
        };
        Compra.findByPk.mockResolvedValue(mockPurchaseNull);

        const result = await serv_getPurchaseById(3);

        expect(result.final_price).toBe(80);
    });

    test("Obtener una compra por ID devuelve null si no existe", async () => {
        Compra.findByPk.mockResolvedValue(null);

        const result = await serv_getPurchaseById(999);

        expect(result).toBeNull();
    });

    // ====================================================
    // CREAR COMPRA
    // ====================================================
    test("Crear una compra ignora datetime_purchase y active", async () => {
        const mockData = {
            id_user: 1,
            id_course: 2,
            datetime_purchase: "2025-01-01",
            active: false,
        };

        const cleanedData = { id_user: 1, id_course: 2 };

        const mockCreated = { id_purchase: 10, ...cleanedData };
        Compra.create.mockResolvedValue(mockCreated);

        const result = await serv_createPurchase(mockData);

        expect(Compra.create).toHaveBeenCalledWith(cleanedData);
        expect(result).toEqual(mockCreated);
    });

    // ====================================================
    // ACTUALIZAR COMPRA
    // ====================================================
    test("Actualizar una compra existente", async () => {
        const mockExisting = {
            update: jest.fn().mockResolvedValue({ id_purchase: 1, dscto: 15 }),
        };

        Compra.findByPk.mockResolvedValue(mockExisting);

        const result = await serv_updatePurchaseById(1, {
            dscto: 15,
            active: false,
            datetime_purchase: "2025-01-01",
        });

        expect(Compra.findByPk).toHaveBeenCalledWith(1);
        expect(mockExisting.update).toHaveBeenCalledWith({ dscto: 15 });
        expect(result).toEqual({ id_purchase: 1, dscto: 15 });
    });

    test("Actualizar una compra devuelve null si no existe", async () => {
        Compra.findByPk.mockResolvedValue(null);

        const result = await serv_updatePurchaseById(999, { dscto: 10 });

        expect(result).toBeNull();
    });

    // ====================================================
    // ELIMINAR COMPRA
    // ====================================================
    test("Eliminar (desactivar) una compra existente", async () => {
        const mockPurchase = {
            update: jest.fn().mockResolvedValue({ id_purchase: 1, active: false }),
        };
        Compra.findByPk.mockResolvedValue(mockPurchase);

        const result = await serv_deletePurchaseById(1);

        expect(Compra.findByPk).toHaveBeenCalledWith(1);
        expect(mockPurchase.update).toHaveBeenCalledWith({ active: false });
        expect(result).toEqual(mockPurchase);
    });

    test("Eliminar una compra devuelve null si no existe", async () => {
        Compra.findByPk.mockResolvedValue(null);

        const result = await serv_deletePurchaseById(999);

        expect(result).toBeNull();
    });
});
