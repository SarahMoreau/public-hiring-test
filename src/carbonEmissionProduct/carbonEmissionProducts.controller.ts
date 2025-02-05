import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Logger, Param, Post } from "@nestjs/common";
import { calculateAndSaveRecipeEmission } from "./calculationCarbonEmissionProduct";
import { CarbonEmissionProduct } from "./carbonEmissionProduct.entity";
import { CarbonEmissionProductsService } from "./carbonEmissionProducts.service";
import { EmissionFactorError, QuantityError, UnknownUnitError } from "./errors";
import { Recipe } from "./recipe.entity";

@Controller("carbon-emission-products")
export class CarbonEmissionProductsController {
    constructor(
        private readonly carbonEmissionProductService: CarbonEmissionProductsService
    ) { }

    @Get(':nameRecipe')
    getCarbonEmissionProduct(@Param('nameRecipe') nameRecipe: string): Promise<CarbonEmissionProduct | null> {
        Logger.log(
            `[carbon-emission-products] [GET] CarbonEmissionProduct: getting carbon emission of ${nameRecipe}`
        );
        return this.carbonEmissionProductService.findProduct(nameRecipe);
    }

    @Get()
    getAllCarbonEmissionProducts(): Promise<CarbonEmissionProduct[]> {
        Logger.log(
            `[carbon-emission-products] [GET] CarbonEmissionProduct: getting all CarbonEmissionProducts`
        );
        return this.carbonEmissionProductService.findAll();
    }

    @Post(':nameRecipe')
    createCarbonEmissionProduct(@Param('nameRecipe') nameRecipe: string,
        @Body() recipe: Recipe
    ): Promise<CarbonEmissionProduct[] | null> {
        ``;
        Logger.log(
            `[carbon-emission-products] [POST] CarbonEmissionProduct: ${nameRecipe} created`
        );
        try {
            return calculateAndSaveRecipeEmission(recipe, nameRecipe);
        }
        catch (error) {
            if ((error instanceof UnknownUnitError) || (error instanceof QuantityError) || (error instanceof EmissionFactorError)) {
                throw new BadRequestException(error.message);
            }
            else {
                throw new InternalServerErrorException(error);
            }
        }
    }
}
