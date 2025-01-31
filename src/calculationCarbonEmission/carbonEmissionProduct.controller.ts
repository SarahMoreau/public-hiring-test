import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { calculateAndSaveRecipeEmission } from "./calculationCarbonEmission.service";
import { Recipe } from "./recipe.entity";

@Controller("carbon-emission-product")
export class CarbonEmissionProductController {
  constructor(
    private readonly carbonEmissionFactorService: CarbonEmissionFactorsService
  ) { }

  @Get(':nameRecipe')
  getCarbonEmissionProduct(@Param('nameRecipe') nameRecipe: string): Promise<CarbonEmissionFactor | null> {
    Logger.log(
      `[carbon-emission-product] [GET] CarbonEmissionProduct: getting carbon emission of ${nameRecipe}`
    );
    return this.carbonEmissionFactorService.findProduct(nameRecipe);
  }

  @Post()
  createCarbonEmissionProduct(
    @Body() recipe: Recipe
  ): Promise<CarbonEmissionFactor[] | null> {
    ``;
    Logger.log(
      `[carbon-emission-product] [POST] CarbonEmissionProduct: hamCheesePizza created`
    );
    return calculateAndSaveRecipeEmission(recipe, "hamCheesePizza");
  }
}
