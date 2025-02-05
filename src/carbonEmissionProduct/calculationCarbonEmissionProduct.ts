import { round } from "lodash";
//import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { dataSource } from "../../config/dataSource";
import { getTestEmissionFactor } from "../seed-dev-data";
import { CarbonEmissionProduct } from "./carbonEmissionProduct.entity";
import { CarbonEmissionProductsService } from "./carbonEmissionProducts.service";
import { convertQuantityToKg } from "./conversionToKg";
import { EmissionFactorError, NullEmissionError, QuantityError, UnknownUnitError } from "./errors";
import { Recipe, RecipeIngredient } from "./recipe.entity";

export const calculateIngredientEmission = (ingredient: RecipeIngredient): number => {
    const emissionFactor = getTestEmissionFactor(ingredient.name);

    if (ingredient.quantity < 0) {
        throw new QuantityError(
            `test quantity '${ingredient.quantity}' is negative.`
        );
    }

    if (emissionFactor.unit != "kg") {
        emissionFactor.emissionCO2eInKgPerUnit = convertQuantityToKg(emissionFactor.unit, emissionFactor.emissionCO2eInKgPerUnit);
    }

    if (ingredient.unit != "kg") {
        ingredient.quantity = convertQuantityToKg(ingredient.unit, ingredient.quantity);
    }

    return round(ingredient.quantity * emissionFactor.emissionCO2eInKgPerUnit, 3);
}

export const calculateRecipeEmission = (recipe: Recipe): number | null => {
    let recipeEmission: number = 0;
    let recipeWeight: number = 0;

    for (let i = 0; i < recipe.ingredients.length; i = i + 1) {
        try {
            recipeEmission += calculateIngredientEmission(recipe.ingredients[i]);
            recipeWeight += recipe.ingredients[i].quantity;
        }
        catch (error) {
            if (error instanceof UnknownUnitError) {
                console.log("Unit can't be convert to kg.");
            }
            if (error instanceof QuantityError) {
                console.log("Quantity value is negative.");
            }
            if (error instanceof EmissionFactorError) {
                console.log("Emission factor doesn't exist.");
            }
            return null;
        }
    }
    return round(recipeEmission / recipeWeight, 3);
}

export const calculateAndSaveRecipeEmission = (recipe: Recipe, nameRecipe: string): Promise<CarbonEmissionProduct[] | null> => {
    const recipeEmission: number | null = calculateRecipeEmission(recipe);
    if (recipeEmission == null) {
        throw new NullEmissionError(`The carbon footprint of the '${nameRecipe}' couldn't be calculated.`);
    }
    const productEmission = new CarbonEmissionProduct({ nameRecipe: nameRecipe, emissionCO2eInKgPerUnit: recipeEmission, source: "Sarah Moreau" });

    let carbonEmissionProductService: CarbonEmissionProductsService;
    carbonEmissionProductService = new CarbonEmissionProductsService(
        dataSource.getRepository(CarbonEmissionProduct)
    );
    return carbonEmissionProductService.save([productEmission]);
}