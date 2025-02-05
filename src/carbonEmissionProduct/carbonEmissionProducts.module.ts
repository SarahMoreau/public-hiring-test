import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
//import { CarbonEmissionProductController } from "../calculationCarbonEmission/carbonEmissionProduct.controller";
//import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
//import { CarbonEmissionFactorsController } from "./carbonEmissionFactors.controller";
//import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";


import { CarbonEmissionProduct } from "./carbonEmissionProduct.entity";
import { CarbonEmissionProductsController } from "./carbonEmissionProducts.controller";
import { CarbonEmissionProductsService } from "./carbonEmissionProducts.service";

@Module({
    imports: [TypeOrmModule.forFeature([CarbonEmissionProduct])],
    providers: [CarbonEmissionProductsService],
    controllers: [CarbonEmissionProductsController],
})
export class CarbonEmissionProductsModule { }
