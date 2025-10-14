export type Unit =
  | "g" // grams
  | "kg" // kilograms
  | "ml" // milliliters
  | "l" // liters
  | "tbsp" // tablespoons
  | "tsp" // teaspoons
  | "cup" // cups
  | "pcs" // pieces
  | "oz" // ounces
  | "cloves" // garlic/cloves
  | "pinch" // pinch
  | "bunch" // bunches of herbs
  | "sprig" // sprigs of herbs
  | "can" // canned goods
  | "package" // packaged goods
  | "bottle" // bottled items
  | "head"; // heads (e.g., garlic, lettuce)

export type Ingredient = {
  id: string; // stable key: "onion"
  label: string; // display: "Yellow onion"
  qty: number; // per-serving quantity
  unit?: string;
  aisle?: string; // e.g. "Produce"
  optional?: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  image?: string;
  category?: string;
  servings: number; // base servings for ingredient qty
  ingredients: Ingredient[];
  prepTime?: string;
  cookTime?: string;
  instructions: string[];
  tags?: string[];
  calories?: number;
  unit?: Unit;
};
