import { convertQuantityToKg } from "./conversionToKg";

describe("ConvertQuantityToKg", () => {
    it("should return 0.3 if the unit is g and the quantity 300", () => {
        expect(convertQuantityToKg("g", 300)).toBe(0.3);
    });
    it("should return 3 if the unit is q and the quantity 0.03", () => {
        expect(convertQuantityToKg("q", 0.03)).toBe(3);
    });
    it("should throw an error if the unit is not define in coefficientsTableKg", () => {
        expect(() => { convertQuantityToKg("km", 300); }).toThrow(Error("test unit 'km' could not be converted to kg"));
    });
    it("should throw an error if the quantity is negative", () => {
        expect(() => { convertQuantityToKg("kg", -5); }).toThrow(Error("test quantity '-5' is not an acceptable value."));
    });
});