import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("carbon_emission_products")
export class CarbonEmissionProduct extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    nameRecipe: string;

    @Column({
        type: "float",
        nullable: false,
    })
    emissionCO2eInKgPerUnit: number;

    @Column({
        nullable: false,
    })
    source: string;

    sanitize() {
        if (this.source === "") {
            throw new Error("Source cannot be empty");
        }
    }

    constructor(props: {
        nameRecipe: string;
        emissionCO2eInKgPerUnit: number;
        source: string;
    }) {
        super();

        this.nameRecipe = props?.nameRecipe;
        this.emissionCO2eInKgPerUnit = props?.emissionCO2eInKgPerUnit;
        this.source = props?.source;
        this.sanitize();
    }
}