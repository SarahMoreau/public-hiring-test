import { round } from "lodash";
import { getTestEmissionFactor } from "../seed-dev-data";
import { convertQuantityToKg } from "./conversionToKg";
import { EmissionFactorError, QuantityError, UnknownUnitError } from "./errors";
import { Recipe, RecipeIngredient } from "./recipe.entity";


const hamCheesePizza = {
    ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "flour", quantity: 0.7, unit: "kg" }, //bug fix floor to flour
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
};

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

    for (let i = 0; i < recipe.ingredients.length; i = i + 1) {
        try {
            recipeEmission += calculateIngredientEmission(recipe.ingredients[i])
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
    return round(recipeEmission, 3);
}
