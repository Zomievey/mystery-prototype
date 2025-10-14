import { Recipe, Ingredient, Unit } from "@/types/recipe";

// Common unit mappings
export const UNIT_MAP: Record<string, Unit> = {
  // Volume
  tbs: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  tbsp: "tbsp",
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  cup: "cup",
  cups: "cup",
  pint: "pint",
  pints: "pint",
  quart: "quart",
  quarts: "quart",
  gallon: "gallon",
  gallons: "gallon",
  ml: "ml",
  milliliter: "ml",
  milliliters: "ml",
  l: "l",
  liter: "l",
  liters: "l",

  // Weight
  g: "g",
  gram: "g",
  grams: "g",
  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",
  oz: "oz",
  ounce: "oz",
  ounces: "oz",
  lb: "lb",
  pound: "lb",
  pounds: "lb",

  // Other
  pinch: "pinch",
  pinches: "pinch",
  dash: "dash",
  dashes: "dash",
  bunch: "bunch",
  bunches: "bunch",
  sprig: "sprig",
  sprigs: "sprig",
  clove: "cloves",
  cloves: "cloves",
  package: "package",
  packages: "package",
  can: "can",
  cans: "can",
  bottle: "bottle",
  bottles: "bottle",
  head: "head",
  heads: "head",
} as const;

export function parseQuantity(measure: string): { qty: number; unit: Unit } {
  if (!measure?.trim()) return { qty: 1, unit: "pcs" };

  const cleanMeasure = measure.trim().toLowerCase();

  // Handle special cases
  if (["to taste", "as needed", "as required"].includes(cleanMeasure)) {
    return { qty: 0, unit: "to taste" };
  }

  // Try different patterns to extract quantity and unit
  const patterns = [
    // 1 1/2 cups, 2.5 tbsp, 3/4 teaspoon
    /^(\d+\s+\d+\/\d+|\d+[.,]?\d*|\d+\/\d+)\s*([a-z]*)$/i,
    // 1 cup, 2 tbsp, 3g
    /^(\d+)\s*([a-z]+)$/i,
    // one cup, two tablespoons
    /^(one|two|three|four|five|six|seven|eight|nine|ten|a|an)\s+([a-z]+)/i,
  ];

  for (const pattern of patterns) {
    const match = cleanMeasure.match(pattern);
    if (match) {
      let qty = 1;
      let unit = (match[2] || "").toLowerCase();

      // Convert word numbers to digits
      const wordToNumber: Record<string, number> = {
        a: 1,
        an: 1,
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
      };

      if (wordToNumber[match[1].toLowerCase()]) {
        qty = wordToNumber[match[1].toLowerCase()];
      } else if (match[1].includes("/")) {
        // Handle fractions
        const [numerator, denominator] = match[1].split("/").map(Number);
        qty = numerator / (denominator || 1);
      } else if (match[1].includes(" ")) {
        // Handle mixed numbers like "1 1/2"
        const [whole, fraction] = match[1].split(" ");
        const [numerator, denominator] = fraction.split("/").map(Number);
        qty = Number(whole) + numerator / (denominator || 1);
      } else {
        qty = parseFloat(match[1].replace(",", ".")) || 1;
      }

      // Map to standard unit or use as-is
      unit = unit && UNIT_MAP[unit] ? UNIT_MAP[unit] : unit || "pcs";

      return { qty, unit };
    }
  }

  // If no pattern matched, return as a custom unit
  return { qty: 1, unit: (cleanMeasure as Unit) || "pcs" };
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeMealDBRecipe(meal: any): Recipe {
  const DEFAULT_SERVINGS = 2;
  const DEFAULT_PREP_TIME = "PT20M"; // 20 minutes in ISO 8601 duration format
  const DEFAULT_COOK_TIME = "PT40M"; // 40 minutes in ISO 8601 duration format

  // Parse ingredients
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();

    if (!ingredient) continue;

    const { qty, unit } = parseQuantity(measure);

    ingredients.push({
      id: `${meal.idMeal}-${i}`,
      label: ingredient,
      qty,
      unit: unit as Unit,
    });
  }

  // Parse instructions
  const instructions = (meal.strInstructions || "")
    .split(/\r?\n/)
    .map((s: string) => s.trim())
    .filter(Boolean);

  // Parse times (if available)
  const prepTime = meal.strPrepTime || DEFAULT_PREP_TIME;
  const cookTime = meal.strCookTime || DEFAULT_COOK_TIME;

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory || "Other",
    prepTime: prepTime !== DEFAULT_PREP_TIME ? prepTime : undefined,
    cookTime: cookTime !== DEFAULT_COOK_TIME ? cookTime : undefined,
    servings: DEFAULT_SERVINGS,
    ingredients,
    instructions,
    // Add any additional fields from your Recipe type
    tags: meal.strTags ? meal.strTags.split(",") : [],
    readyInMinutes: calculateTotalMinutes(prepTime, cookTime),
  };
}

// Helper function to calculate total time in minutes
function calculateTotalMinutes(prepTime: string, cookTime: string): number {
  const parseDuration = (duration: string): number => {
    if (!duration) return 0;

    // Simple implementation - in a real app, use a proper duration parser
    const match = duration.match(/PT(\d+)M/);
    return match ? parseInt(match[1], 10) : 0;
  };

  return parseDuration(prepTime) + parseDuration(cookTime);
}
