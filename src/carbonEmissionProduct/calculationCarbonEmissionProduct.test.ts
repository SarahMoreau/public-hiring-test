import { dataSource, GreenlyDataSource } from "../../config/dataSource";
import { calculateAndSaveRecipeEmission, calculateIngredientEmission, calculateRecipeEmission } from "./calculationCarbonEmissionProduct";
import { CarbonEmissionProduct } from "./carbonEmissionProduct.entity";
import { CarbonEmissionProductsService } from "./carbonEmissionProducts.service";
import { NullEmissionError } from "./errors";

const hamCheesePizza = {
    ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "flour", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
};

const hamCheesePizzaWithFloor = {
    ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "floor", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
};

const hamCheesePizzaWithNegativeQuantitiy = {
    ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: -0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "flour", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
};

const hamCheesePizzaWithNoCheese = {
    ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "flour", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
};

const cheesePizza = {
    ingredients: [
        { name: "cheese", quantity: 250, unit: "g" },
        { name: "blueCheese", quantity: 100, unit: "g" },
        { name: "flour", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
};

let carbonEmissionProductService: CarbonEmissionProductsService;


beforeAll(async () => {
    await dataSource.initialize();
    carbonEmissionProductService = new CarbonEmissionProductsService(
        dataSource.getRepository(CarbonEmissionProduct)
    );
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe("CalculateIngredientEmission", () => {
    it("should return 0.011 if the quantity is 0.1kg and the emission of CO2 per Kg is 0.11", () => {
        expect(calculateIngredientEmission({ name: "ham", quantity: 0.1, unit: "kg" })).toBe(0.011);
    });

    it("should return 0.011 if the quantity is 100g and the emission of CO2 per Kg is 0.11", () => {
        expect(calculateIngredientEmission({ name: "ham", quantity: 100, unit: "g" })).toBe(0.011);
    });

});

describe("CalculateRecipeEmission", () => {
    it("should return 0.224 for the C02 emission of hamCheesePizza", () => {
        expect(calculateRecipeEmission(hamCheesePizza)).toBe(0.136);
    });

    it("should return null because of an EmissionFactorError", () => {
        expect(calculateRecipeEmission(hamCheesePizzaWithFloor)).toBe(null);
    });

    it("should return null because of an QuantityError", () => {
        expect(calculateRecipeEmission(hamCheesePizzaWithNegativeQuantitiy)).toBe(null);
    });

    it("should return 0.224 for the C02 emission of hamCheesePizzaWithNoCheese because cheese quantity = 0", () => {
        expect(calculateRecipeEmission(hamCheesePizzaWithNoCheese)).toBe(0.137);
    });

    it("should return 0.207 for the C02 emission of cheesePizza", () => {
        expect(calculateRecipeEmission(cheesePizza)).toBe(0.153);
    });
});

describe("calculationCarbonEmission.service", () => {
    it("should save hamCheesePizza emission", async () => {
        await calculateAndSaveRecipeEmission(hamCheesePizza, "hamCheesePizza");
        const retrieveHamCheesePizzaEmission = await dataSource
            .getRepository(CarbonEmissionProduct)
            .findOne({ where: { nameRecipe: "hamCheesePizza" } });
        expect(retrieveHamCheesePizzaEmission?.nameRecipe).toBe("hamCheesePizza");
    });

    it("should throw an error if pizza emission is null", () => {
        expect(() => { calculateAndSaveRecipeEmission(hamCheesePizzaWithNegativeQuantitiy, "hamCheesePizzaWithNegativeQuantity"); })
            .toThrow(NullEmissionError);
    });
});

afterAll(async () => {
    await dataSource.destroy();
});