import { QuantityError, UnknownUnitError } from "./errors";

export const coefficientsTableKg = [
    { unit: "mg", coef: 0.000001 },
    { unit: "cg", coef: 0.00001 },
    { unit: "dg", coef: 0.0001 },
    { unit: "g", coef: 0.001 },
    { unit: "dag", coef: 0.01 },
    { unit: "hg", coef: 0.1 },
    { unit: "kg", coef: 1 },
    { unit: "q", coef: 100 },
    { unit: "t", coef: 1000 },
];

export const convertQuantityToKg = (unit: string, quantity: number): number => {
    const ingredientUnit = coefficientsTableKg.find(
        (ef) => ef.unit === unit
    );

    if (!ingredientUnit) {
        throw new UnknownUnitError(
            `test unit '${unit}' could not be converted to kg`
        );
    }

    if (quantity < 0) {
        throw new QuantityError(
            `test quantity '${quantity}' is negative.`
        );
    }
    return quantity * ingredientUnit.coef;
}