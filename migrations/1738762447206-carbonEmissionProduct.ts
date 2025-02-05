import { MigrationInterface, QueryRunner } from "typeorm";

export class CarbonEmissionProduct1738762447206 implements MigrationInterface {
    name = 'CarbonEmissionProduct1738762447206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carbon_emission_products" ("id" SERIAL NOT NULL, "nameRecipe" character varying NOT NULL, "emissionCO2eInKgPerUnit" double precision NOT NULL, "source" character varying NOT NULL, CONSTRAINT "PK_58a6501af10de422f2588343427" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "carbon_emission_products"`);
    }

}
