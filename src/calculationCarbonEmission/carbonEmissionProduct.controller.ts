import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
//import { CreateCarbonEmissionFactorDto } from "../carbonEmissionFactor/dto/create-carbonEmissionFactor.dto";
import { calculateAndSaveRecipeEmission } from "./calculationCarbonEmission.service";
import { Recipe } from "./recipe.entity";

@Controller("carbon-emission-product")
export class CarbonEmissionProductController {
  constructor(
    private readonly carbonEmissionFactorService: CarbonEmissionFactorsService
  ) { }

  @Get()
  getCarbonEmissionProduct(): Promise<CarbonEmissionFactor[]> {
    Logger.log(
      `[carbon-emission-product] [GET] CarbonEmissionProduct: getting all CarbonEmissionProduct`
    );
    return this.carbonEmissionFactorService.findAll();
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
