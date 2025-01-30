import { dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { calculateAndSaveRecipeEmission } from "./calculationCarbonEmission.service";
import { NullEmissionError } from "./errors";

let carbonEmissionFactorService: CarbonEmissionFactorsService;


const hamCheesePizza = {
    ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "flour", quantity: 0.7, unit: "kg" }, //bug fix floor to flour
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

beforeAll(async () => {
    await dataSource.initialize();
    carbonEmissionFactorService = new CarbonEmissionFactorsService(
        dataSource.getRepository(CarbonEmissionFactor)
    );
});

// beforeEach(async () => {
//     await GreenlyDataSource.cleanDatabase();
//     await dataSource
//         .getRepository(CarbonEmissionFactor)
//         .save(olivedOilEmissionFactor);
// });

describe("calculationCarbonEmission.service", () => {
    it("should save hamCheesePizza emission", async () => {
        await calculateAndSaveRecipeEmission(hamCheesePizza, "hamCheesePizza");
        const retrieveHamCheesePizzaEmission = await dataSource
            .getRepository(CarbonEmissionFactor)
            .findOne({ where: { name: "hamCheesePizza" } });
        expect(retrieveHamCheesePizzaEmission?.name).toBe("hamCheesePizza");
    });

    it("should throw an error if pizza emission is null", () => {
        expect(() => { calculateAndSaveRecipeEmission(hamCheesePizzaWithNegativeQuantitiy, "hamCheesePizzaWithNegativeQuantity"); }).toThrow(NullEmissionError);
    });
});

afterAll(async () => {
    await dataSource.destroy();
});