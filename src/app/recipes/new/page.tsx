// app/recipes/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Ingredient = {
  id: string;
  label: string;
  qty: number;
  unit: string;
};

type Recipe = {
  id?: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
  servings?: number;
  prepTime?: string;
  cookTime?: string;
};

export default function NewRecipePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("newRecipe");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Recipe;
        // if no id yet, make a client-only temp id for UI keys (not persisted)
        if (!parsed.id)
          parsed.id = `tmp-${Math.random().toString(36).slice(2, 10)}`;
        setRecipe(parsed);
      } catch {
        setRecipe(null);
      }
    }
  }, []);

  if (!recipe) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="mb-4">No recipe data found.</p>
          <Link href="/recipes/upload" className="text-primary underline">
            Go back to upload
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{recipe.title}</h1>
          <Link
            href="/recipes"
            className="text-sm text-foreground/70 hover:underline"
          >
            Back to recipes
          </Link>
        </div>

        <p className="text-sm text-foreground/70">
          {recipe.prepTime ? "prep • " : ""}
          {recipe.cookTime ? "cook • " : ""}
          {recipe.servings ? `${recipe.servings} servings` : ""}
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold mb-3">Instructions</h2>
            {recipe.instructions?.length ? (
              <ol className="list-decimal pl-5 space-y-2">
                {recipe.instructions.map((step, i) => (
                  <li
                    key={`${recipe.id}-step-${i}`}
                    className="text-sm leading-relaxed"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-foreground/60">
                No instructions detected.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
            {recipe.ingredients?.length ? (
              <ul className="list-disc pl-5 space-y-2">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id} className="text-sm leading-relaxed">
                    {ing.qty ? `${ing.qty} ` : ""}
                    {ing.unit && ing.unit !== "pcs" ? `${ing.unit} ` : ""}
                    {ing.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground/60">
                No ingredients detected.
              </p>
            )}
          </section>
        </div>

        {/* You can add a Save button here to POST to your API and persist */}
      </div>
    </main>
  );
}
