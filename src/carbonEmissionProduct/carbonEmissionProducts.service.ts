import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionProduct } from "./carbonEmissionProduct.entity";
import { CreateCarbonEmissionProductDto } from "./dto/create-carbonEmissionProduct.dto";

@Injectable()
export class CarbonEmissionProductsService {
    constructor(
        @InjectRepository(CarbonEmissionProduct)
        private carbonEmissionProductRepository: Repository<CarbonEmissionProduct>
    ) { }

    findAll(): Promise<CarbonEmissionProduct[]> {
        return this.carbonEmissionProductRepository.find();
    }

    findProduct(nameRecipe: string): Promise<CarbonEmissionProduct | null> {
        return this.carbonEmissionProductRepository.findOne({ where: { nameRecipe: nameRecipe } });
    }

    save(
        carbonEmissionProduct: CreateCarbonEmissionProductDto[]
    ): Promise<CarbonEmissionProduct[] | null> {
        return this.carbonEmissionProductRepository.save(carbonEmissionProduct);
    }
}