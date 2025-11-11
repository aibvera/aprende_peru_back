import { expect, jest } from "@jest/globals";

// --- MOCK DE MODELOS (antes de importar el servicio real)
jest.unstable_mockModule("../../models/models.index.js", () => ({
    Usuario: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    }
}));

// --- IMPORTAR LOS MÓDULOS MOCKEADOS Y SERVICIOS ---
const { Usuario } = await import("../../models/models.index.js");
const {
    serv_getAllUsers,
    serv_getUserById,
    serv_getUserByUsername,
    serv_createUser,
    serv_updateUserById,
    serv_deleteUserById,
} = await import("../../services/usuarios.service.js");

// --- BLOQUE DE TESTS ---
describe("🧠 Servicio de Usuarios (unit)", () => {
    beforeEach(() => jest.clearAllMocks());
    afterEach(() => jest.clearAllMocks());

    // ====================================================
    // CREAR USUARIO
    // ====================================================
    test("Crea un usuario correctamente y lo devuelve sin contraseña", async () => {
        const mockData = {
            username: "bertasa",
            password: "guauguau",
            first_name: "Berta",
            last_name: "Bueno",
            email: "berta@gmail.com",
            get: jest.fn(() => ({
                username: "bertasa",
                first_name: "Berta", last_name: "Bueno",
                email: "berta@gmail.com",
            }))
        };
        Usuario.create.mockResolvedValue(mockData);

        const result = await serv_createUser(mockData);

        expect(Usuario.create).toHaveBeenCalledWith(mockData);
        expect(result.username).toBe("bertasa");
        expect(result.last_name).toBe("Bueno");
        expect(result).not.toHaveProperty("password");
    });

    test("Crea un usuario con nombre de usuario inválido", async () => {
        const mockData = {
            username: "bertasaMuyLargasaDemasiadoLargasaLaVerdadBertasasasa",
            password: "guauguau",
            first_name: "Berta",
            last_name: "Bueno",
            email: "berta@gmail.com"
        };
        const dbError = new Error("validation error");
        Usuario.create.mockRejectedValue(dbError);

        await expect(serv_createUser(mockData)).rejects.toThrow("validation error");

        expect(Usuario.create).toHaveBeenCalledWith(expect.objectContaining({
            username: mockData.username,
        }));
    });

    // ====================================================
    // OBTENER USUARIOS
    // ====================================================
    test("Obtener todos los usuarios", async () => {
        const mockUsers = [
            {
                username: "bertasa",
                first_name: "Berta",
                last_name: "Bueno",
                email: "berta.bueno@gmail.com",
            },
            {
                username: "juanperez",
                first_name: "Juan",
                last_name: "Pérez",
                email: "juan.perez@gmail.com",
            },
        ];
        Usuario.findAll.mockResolvedValue(mockUsers);

        const result = await serv_getAllUsers();

        expect(Usuario.findAll).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual(
            expect.objectContaining({
                username: "bertasa",
                first_name: "Berta",
                last_name: "Bueno",
                email: "berta.bueno@gmail.com",
            })
        );
    });

    test("Obtener usuario por username", async() => {
        const mockUser = {
            username: "bertasa",
            first_name: "Berta",
            last_name: "Bueno",
            email: "berta.bueno@gmail.com",
        };
        Usuario.findOne.mockResolvedValue(mockUser);

        const result = await serv_getUserByUsername("bertasa");

        expect(Usuario.findOne).toHaveBeenCalledWith({
            where: { username: "bertasa" },
            attributes: { exclude: ["password"] },
        });
        expect(result).toEqual(mockUser);
    });

    test("Obtener usuario por ID", async() => {
        const mockUser = {
            username: "bertasa",
            first_name: "Berta",
            last_name: "Bueno",
            email: "berta.bueno@gmail.com",
        };
        Usuario.findByPk.mockResolvedValue(mockUser);

        const result = await serv_getUserById(1);

        expect(Usuario.findByPk).toHaveBeenCalledWith(1, expect.objectContaining({
            attributes: { exclude: ["password"] },
        }));
        expect(result).toEqual(mockUser);
    });

    // ====================================================
    // ACTUALIZAR USUARIO
    // ====================================================
    test("Actualizar usuario por ID", async() => {
        const mockUser = {
            username: "bertita",
            first_name: "Berta",
            last_name: "Bueno",
            email: "berta.bueno@gmail.com",
            update: jest.fn().mockResolvedValue({
                username: "bertasa",
                first_name: "Berta",
                last_name: "Bueno",
                email: "berta.bueno@gmail.com",
            }),
            get: jest.fn(() => ({
                username: "bertasa",
                first_name: "Berta",
                last_name: "Bueno",
                email: "berta.bueno@gmail.com",
            }))
        };
        Usuario.findByPk.mockResolvedValue(mockUser);

        const result = await serv_updateUserById(1, { username: "bertasa" });

        expect(Usuario.findByPk).toHaveBeenCalledWith(1);
        expect(mockUser.update).toHaveBeenCalledWith({ username: "bertasa" });
        expect(result.username).toBe("bertasa");
    });

    test("Devuelve null al intentar actualizar un usuario inexistente", async () => {
        Usuario.findByPk.mockResolvedValue(null);

        const result = await serv_updateUserById(999, { username: "Nada" });

        expect(result).toBeNull();
    });

    // ====================================================
    // ELIMINAR USUARIO
    // ====================================================
    test("Elimina un usuario por ID", async () => {
        const mockUser = {
            id_user: 10,
            username: "bertita",
            first_name: "Berta",
            last_name: "Bueno",
            email: "berta.bueno@gmail.com",
            destroy: jest.fn().mockResolvedValue(),
            get: jest.fn(() => ({
                id_user: 10,
                username: "bertita",
                first_name: "Berta",
                last_name: "Bueno",
                email: "berta.bueno@gmail.com",
            }))
        };
        Usuario.findByPk.mockResolvedValue(mockUser);

        const result = await serv_deleteUserById(10);

        expect(Usuario.findByPk).toHaveBeenCalledWith(10);
        expect(mockUser.destroy).toHaveBeenCalledTimes(1);
        expect(result.username).toBe("bertita");
    });

    test("Devuelve null al intentar eliminar un usuario inexistente", async () => {
        Usuario.findByPk.mockResolvedValue(null);

        const result = await serv_deleteUserById(404);

        expect(result).toBeNull();
    });
});
