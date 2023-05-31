const request = require("supertest");
const server = require("../app.js");
describe("Operaciones CRUD", () => {
    it("Obteniendo un 200 para ver todos los ususarios", async () => {
        const response = await request(server).get("/usu").send();
        const status = response.statusCode;
        expect(status).toBe(200);
    });

    it("Obteniendo un 200 para comprobar el login de un usuario", async () => {
        const response = await request(server).post("/login").send();
        const status = response.statusCode;
        expect(status).toBe(200);
    });

    it("Obteniendo un 200 para ver todos los productos ", async () => {
        const response = await request(server).get("/productos").send();
        const status = response.statusCode;
        expect(status).toBe(200);
    });

    it("Obteniendo un 200 para comprobar eliminar un producto", async () => {
        const response = await request(server).delete("/productos/:id_producto").send();
        const status = response.statusCode;
        expect(status).toBe(200);
    });
});