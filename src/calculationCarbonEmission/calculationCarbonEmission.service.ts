import { dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { calculateRecipeEmission } from "./calculationCarbonEmission";
import { NullEmissionError } from "./errors";
import { Recipe } from "./recipe.entity";

export const calculateAndSaveRecipeEmission = async (recipe: Recipe, nameRecipe: string) => {
    const recipeEmission: number | null = calculateRecipeEmission(recipe);
    console.log("ICI !" + recipeEmission);
    if (recipeEmission == null) {
        throw new NullEmissionError(`The carbon footprint of the '${nameRecipe}' couldn't be calculated.`);
    }
    const productEmission = new CarbonEmissionFactor({ name: nameRecipe, unit: "kgCO2e/kgproduct", emissionCO2eInKgPerUnit: recipeEmission, source: "Sarah Moreau" });

    let carbonEmissionFactorService: CarbonEmissionFactorsService;
    carbonEmissionFactorService = new CarbonEmissionFactorsService(
        dataSource.getRepository(CarbonEmissionFactor)
    );
    await carbonEmissionFactorService.save([productEmission]);
}
