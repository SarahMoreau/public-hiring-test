export class RecipeIngredient {
    name: string;
    quantity: number;
    unit: string;
};

export class Recipe {
    ingredients: RecipeIngredient[];
}