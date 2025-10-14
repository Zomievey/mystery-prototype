// lib/ocrParser.ts
import { Recipe, Ingredient, Unit } from "@/types/recipe";
import {
  createWorker,
  PSM,
  type LoggerMessage,
  type Worker as TesseractWorker,
  type WorkerParams,
} from "tesseract.js";

interface ParserOptions {
  defaultServings?: number;
  defaultPrepTime?: string;
  defaultCookTime?: string;
}

const DEFAULT_OPTIONS: ParserOptions = {
  defaultServings: 2,
  defaultPrepTime: "PT20M",
  defaultCookTime: "PT40M",
};

export async function parseRecipeFromText(
  text: string,
  options: ParserOptions = {},
): Promise<Recipe> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // No Date.now() here to avoid SSR hydration drift
  const recipe: Partial<Recipe> = {
    title: "Imported Recipe",
    ingredients: [],
    instructions: [],
    servings: opts.defaultServings,
    prepTime: opts.defaultPrepTime,
    cookTime: opts.defaultCookTime,
  };

  // Title: prefer first non-header content line
  recipe.title = lines[0] || "Untitled Recipe";
  if (
    !recipe.title ||
    /^(ingredients|instructions|directions|method):?$/i.test(recipe.title)
  ) {
    const firstContent = lines.find(
      (l) => l && !/^(ingredients|instructions|directions|method):?$/i.test(l),
    );
    if (firstContent) recipe.title = firstContent;
  }

  // --- helpers ---------------------------------------------------------------

  function normalizeQuotes(s: string) {
    // straighten curly quotes/dashes that OCR introduces
    return s.replace(/[“”]/g, '"').replace(/’/g, "'").replace(/–/g, "-");
  }

  function isLikelyInstruction(line: string) {
    const L = normalizeQuotes(line).trim();
    // Numbered step like "1." / "2)" / "3 -"
    if (/^\s*\d+\s*[.)-]\s+/.test(L)) return true;
    // Common cooking verbs at the start
    return /^(preheat|mix|combine|stir|whisk|fold|spoon|bake|cool|add|pour|beat|sift|cook|heat|serve)\b/i.test(
      L,
    );
  }

  // Parse sections (handles when OCR mixes a step inside ingredients)
  let inIngredientsSection = false;
  let inInstructionsSection = false;

  for (const lineRaw of lines) {
    const line = normalizeQuotes(lineRaw);
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes("ingredients")) {
      inIngredientsSection = true;
      inInstructionsSection = false;
      continue;
    }
    if (
      lowerLine.includes("instructions") ||
      lowerLine.includes("directions")
    ) {
      inIngredientsSection = false;
      inInstructionsSection = true;
      continue;
    }

    if (inIngredientsSection) {
      if (isLikelyInstruction(line)) {
        inInstructionsSection = true;
        inIngredientsSection = false;
        recipe.instructions = [...(recipe.instructions || []), line];
      } else {
        const ingredient = parseIngredientLine(line);
        if (ingredient) {
          recipe.ingredients = [...(recipe.ingredients || []), ingredient];
        }
      }
    } else if (inInstructionsSection) {
      if (line.length > 3) {
        recipe.instructions = [...(recipe.instructions || []), line];
      }
    }
  }

  // If no explicit sections, attempt to separate using heuristics
  if (!inIngredientsSection && !inInstructionsSection) {
    const { ingredients, instructions } = separateIngredientsAndInstructions(
      lines,
      normalizeQuotes,
      isLikelyInstruction,
    );
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
  }

  if (!recipe.instructions?.length) {
    recipe.instructions = ["No instructions provided."];
  }

  return recipe as Recipe;
}

function separateIngredientsAndInstructions(
  lines: string[],
  normalizeQuotes: (s: string) => string,
  isLikelyInstruction: (s: string) => boolean,
): {
  ingredients: Ingredient[];
  instructions: string[];
} {
  const ingredients: Ingredient[] = [];
  const instructions: string[] = [];
  let foundInstructions = false;

  for (let line of lines) {
    if (
      !line.trim() ||
      line
        .toLowerCase()
        .match(/^(ingredients|instructions|directions|method):?$/i)
    ) {
      continue;
    }

    line = normalizeQuotes(line);

    if (isLikelyInstruction(line)) {
      foundInstructions = true;
      instructions.push(line);
      continue;
    }

    if (!foundInstructions) {
      const ingredient = parseIngredientLine(line);
      if (ingredient) {
        ingredients.push(ingredient);
        continue;
      } else {
        foundInstructions = true;
      }
    }

    if (foundInstructions) {
      instructions.push(line);
    }
  }

  return { ingredients, instructions };
}

function parseIngredientLine(line: string): Ingredient | null {
  line = line ? line : "";
  line = line.replace(/[“”]/g, '"').replace(/’/g, "'").replace(/–/g, "-");

  if (!line.trim() || line.trim().endsWith(":")) {
    return null;
  }

  const cleanLine = line
    .replace(/^[•\-*]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

  const patterns = [
    // "1 cup sugar" / "1/2 tsp salt" / "1 1/2 cups sugar"
    /^(?<qty>[\d\s\/½¼¾.]+)?\s*(?<unit>tsp|tbsp|cup|cups|g|kg|ml|l|oz|lb|pound|pounds|teaspoon|tablespoon|gram|kilogram|milliliter|liter|ounce|pinch|dash|bunch|sprig|clove|cloves|package|can|bottle|head|heads|pcs|pieces)?\s*(?<name>.+)$/i,
    // "sugar 1 cup"
    /^(?<name>.+?)\s+(?<qty>[\d\s\/½¼¾.]+)?\s*(?<unit>tsp|tbsp|cup|g|kg|ml|l|oz|lb|pound|pounds|teaspoon|tablespoon|gram|kilogram|milliliter|liter|ounce|pinch|dash|bunch|sprig|clove|cloves|package|can|bottle|head|heads|pcs|pieces)?$/i,
  ];

  for (const pattern of patterns) {
    const match = cleanLine.match(pattern);
    if (match?.groups) {
      const {
        qty = "",
        unit = "",
        name = "",
      } = match.groups as {
        qty?: string;
        unit?: string;
        name?: string;
      };

      const cleanName = name
        .replace(/[\d\/\s.]+$/, "")
        .replace(/[,;.]*$/, "")
        .trim();

      let parsedQty = 1;
      if (qty) {
        if (/\d+\s+\d+\/\d+/.test(qty)) {
          const [whole, fraction] = qty.split(/\s+/);
          const [numerator, denominator] = fraction.split("/").map(Number);
          parsedQty = Number(whole) + numerator / (denominator || 1);
        } else if (qty.includes("/")) {
          const [numerator, denominator] = qty.split("/").map(Number);
          parsedQty = numerator / (denominator || 1);
        } else {
          parsedQty = parseFloat(qty) || 1;
        }
      }

      const unitMap: Record<string, Unit> = {
        tsp: "tsp",
        teaspoon: "tsp",
        teaspoons: "tsp",
        tbsp: "tbsp",
        tablespoon: "tbsp",
        tablespoons: "tbsp",
        cup: "cup",
        cups: "cup",
        g: "g",
        gram: "g",
        grams: "g",
        kg: "kg",
        kilogram: "kg",
        kilograms: "kg",
        ml: "ml",
        milliliter: "ml",
        milliliters: "ml",
        l: "l",
        liter: "l",
        liters: "l",
        oz: "oz",
        ounce: "oz",
        ounces: "oz",
        lb: "lb",
        pound: "lb",
        pounds: "lb",
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
        pcs: "pcs",
        piece: "pcs",
        pieces: "pcs",
      };

      const cleanUnit = (unit || "").toLowerCase();
      const standardUnit = (cleanUnit && unitMap[cleanUnit]) || "pcs";

      return {
        // temp id (client-only); make a real id when persisting
        id: `ing-${Math.random().toString(36).slice(2, 11)}`,
        label: cleanName,
        qty: parsedQty,
        unit: standardUnit,
      };
    }
  }

  return {
    id: `ing-${Math.random().toString(36).slice(2, 11)}`,
    label: line.trim(),
    qty: 1,
    unit: "pcs",
  };
}

type ProgressCallback = (p: { status: string; progress: number }) => void;

export async function processImageUpload(
  file: File,
  progressCallback?: ProgressCallback,
): Promise<string> {
  // v5 signature: createWorker(langs?, oem?, options?, cacheMethod?)
  const worker: TesseractWorker = await createWorker(
    ["eng"],
    undefined, // OEM (optional) – leaving undefined is fine
    {
      logger: (m: LoggerMessage) => {
        if (!progressCallback) return;
        const pct = Math.min(100, Math.round((m.progress ?? 0) * 100));
        const status =
          m.status === "loading language traineddata"
            ? "Loading OCR model..."
            : m.status === "initialized api"
              ? "Analyzing image..."
              : m.status === "recognizing text"
                ? `Recognizing text... (${pct}%)`
                : (m.status ?? "Working...");
        const bar =
          m.status === "recognizing text" ? 10 + pct * 0.8 : m.status ? 10 : 0;
        progressCallback({ status, progress: bar });
      },
    },
  );

  try {
    // Robust recognition: AUTO first, fallback to SPARSE_TEXT if weak
    async function doRecognize(psm: PSM) {
      await worker.setParameters({
        tessedit_pageseg_mode: psm, // enum type-safe
        preserve_interword_spaces: "1",
        user_defined_dpi: "300",
      } satisfies Partial<WorkerParams>);
      return worker.recognize(file);
    }

    let text: string;
    const r1 = await doRecognize(PSM.AUTO);
    text = (r1.data.text ?? "").trim();

    if (text.length < 40) {
      const r2 = await doRecognize(PSM.SPARSE_TEXT);
      text = ((r2.data.text as string) || "").trim();
    }

    return text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join("\n");
  } finally {
    await worker.terminate();
  }
}
