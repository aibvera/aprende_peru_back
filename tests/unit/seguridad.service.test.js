import { expect, jest } from "@jest/globals";
import bcrypt from "bcrypt";

// --- MOCK DE MODELOS (antes de importar el servicio real)
jest.unstable_mockModule("../../models/models.index.js", () => ({
    Usuario: {
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    }
}));

// --- IMPORTAR LOS MÓDULOS MOCKEADOS Y SERVICIOS ---
const { Usuario } = await import("../../models/models.index.js");
const {
    serv_login
} = await import("../../services/seguridad.service.js");

// --- BLOQUE DE TESTS ---
describe("🧠 Servicio de Seguridad (unit)", () => {
    beforeEach(() => jest.clearAllMocks());
    afterEach(() => jest.clearAllMocks());

    // ====================================================
    // LOGIN
    // ====================================================
    test("Login correcto", async() => {
        const mockUser = {
            username: "bertasa",
            password: "guauguau",
            first_name: "Berta",
            last_name: "Bueno",
            email: "berta@gmail.com",
        };
        Usuario.findOne.mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

        const result = await serv_login("bertasa", "guauguau");

        expect(Usuario.findOne).toHaveBeenCalledWith({
            where: { username: "bertasa" },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith("guauguau", mockUser.password);
        expect(result).toEqual(mockUser);

        bcrypt.compare.mockRestore();
    });

    test("Login falla si la contraseña es incorrecta", async () => {
        const mockUser = {
            username: "bertasa",
            password: "guauguau",
            first_name: "Berta",
            last_name: "Bueno",
            email: "berta@gmail.com",
        };
        Usuario.findOne.mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

        const result = await serv_login("bertasa", "contraseña_incorrecta");

        expect(Usuario.findOne).toHaveBeenCalledWith({
            where: { username: "bertasa" },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith("contraseña_incorrecta", mockUser.password);
        expect(result).toBeNull();

        bcrypt.compare.mockRestore();
    });

    test("Login falla si el usuario no existe", async () => {
        Usuario.findOne.mockResolvedValue(null);
        const spyCompare = jest.spyOn(bcrypt, "compare");

        const result = await serv_login("usuario_inexistente", "cualquier_clave");

        expect(Usuario.findOne).toHaveBeenCalledWith({
            where: { username: "usuario_inexistente" },
        });
        expect(spyCompare).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });
});
