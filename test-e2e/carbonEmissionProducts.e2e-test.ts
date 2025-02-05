import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";

const hamCheesePizzaEmission = {
    nameRecipe: "hamCheesePizza",
    emissionCO2eInKgPerUnit: 0.136,
    source: "Sarah Moreau",
};

beforeAll(async () => {
    await dataSource.initialize();
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("CarbonEmissionProductController", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });


    it("GET /carbon-emission-products", async () => {
        return request(app.getHttpServer())
            .get("/carbon-emission-products/cheesePizza")
            .expect(200)
            .expect(({ body }) => {
                expect(body).toMatchObject({});
            });
    });

    it("POST /carbon-emission-products", async () => {
        const hamCheesePizza = {
            ingredients: [
                { name: "ham", quantity: 0.1, unit: "kg" },
                { name: "cheese", quantity: 0.15, unit: "kg" },
                { name: "tomato", quantity: 0.4, unit: "kg" },
                { name: "flour", quantity: 0.7, unit: "kg" },
                { name: "oliveOil", quantity: 0.3, unit: "kg" },
            ],
        };
        await request(app.getHttpServer())
            .post("/carbon-emission-products/hamCheesePizza")
            .send(hamCheesePizza)
            .expect(201)
            .expect(({ body }) => {
                expect(body.length).toEqual(1);
                expect(body[0]).toMatchObject(hamCheesePizzaEmission);
            });
    });

    it("GET /carbon-emission-product", async () => {
        return request(app.getHttpServer())
            .get("/carbon-emission-products/hamCheesePizza")
            .expect(200)
            .expect(({ body }) => {
                expect(body).toMatchObject(hamCheesePizzaEmission);
            });
    });

    it("POST /carbon-emission-products", async () => {
        const hamCheesePizza = {
            ingredients: [
                { name: "ham", quantity: 0.1, unit: "kg" },
                { name: "cheese", quantity: -0.15, unit: "kg" },
                { name: "tomato", quantity: 0.4, unit: "kg" },
                { name: "flour", quantity: 0.7, unit: "kg" },
                { name: "oliveOil", quantity: 0.3, unit: "kg" },
            ],
        };
        await request(app.getHttpServer())
            .post("/carbon-emission-products/hamCheesePizza")
            .send(hamCheesePizza)
            .expect(500)
    });
});
