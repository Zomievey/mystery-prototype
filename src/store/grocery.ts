import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Ingredient, Recipe } from "@/types/recipe";

export type ListItem = {
  key: string; // e.g. "garlic|pcs"
  id: string; // ingredient id
  label: string;
  unit?: string;
  aisle?: string;
  qty: number; // total qty across recipes (in base unit)
  checked?: boolean;
  sources: { recipeId: string; servings: number }[]; // provenance
};

type GroceryState = {
  items: Record<string, ListItem>; // key -> item
  addItem: (
    i: Omit<ListItem, "checked" | "sources">,
    source?: { recipeId: string; servings: number },
  ) => void;
  removeItem: (key: string) => void;
  toggle: (key: string) => void;
  clear: () => void;
  addRecipe: (recipe: Recipe, targetServings?: number) => void;
};

function keyFor(ing: Pick<Ingredient, "id" | "unit">) {
  return `${ing.id}|${ing.unit ?? ""}`;
}

// naive merge (same unit); later we can normalize units (tsp->tbsp->cup, g->kg)
export const useGrocery = create<GroceryState>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (i, source) =>
        set((s) => {
          const existing = s.items[i.key];
          const next: ListItem = existing
            ? {
                ...existing,
                qty: existing.qty + i.qty,
                sources: source
                  ? [...existing.sources, source]
                  : existing.sources,
              }
            : { ...i, checked: false, sources: source ? [source] : [] };
          return { items: { ...s.items, [i.key]: next } };
        }),
      removeItem: (key) =>
        set((s) => {
          const { [key]: _, ...rest } = s.items;
          return { items: rest };
        }),
      toggle: (key) =>
        set((s) => ({
          items: {
            ...s.items,
            [key]: { ...s.items[key], checked: !s.items[key].checked },
          },
        })),
      clear: () => set({ items: {} }),
      addRecipe: (recipe, targetServings = recipe.servings) => {
        const scale = targetServings / (recipe.servings || 1);
        recipe.ingredients.forEach((ing) => {
          const key = keyFor(ing);
          get().addItem(
            {
              key,
              id: ing.id,
              label: ing.label,
              unit: ing.unit,
              aisle: ing.aisle,
              qty: (ing.qty || 0) * scale,
            },
            { recipeId: recipe.id, servings: targetServings },
          );
        });
      },
    }),
    { name: "mm-grocery", storage: createJSONStorage(() => localStorage) },
  ),
);
