import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
//import { CarbonEmissionProductController } from "../calculationCarbonEmission/carbonEmissionProduct.controller";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsController } from "./carbonEmissionFactors.controller";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";

@Module({
  imports: [TypeOrmModule.forFeature([CarbonEmissionFactor])],
  providers: [CarbonEmissionFactorsService],
  // controllers: [CarbonEmissionFactorsController, CarbonEmissionProductController],
  controllers: [CarbonEmissionFactorsController],
})
export class CarbonEmissionFactorsModule { }
