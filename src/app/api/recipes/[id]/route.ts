// src/app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }, // matches .next/types/validator.ts
) {
  const { id } = await context.params;

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    { next: { revalidate: 300 } },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Upstream request failed" },
      { status: 502 },
    );
  }

  const json = await res.json();

  if (!json.meals || json.meals.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const meal = json.meals[0];

  const normalizedMeal = {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    instructions: meal.strInstructions,
    prepTime: null,
    cookTime: null,
    servings: 2,
    ingredients: Array.from({ length: 20 })
      .map((_, i) => ({
        id: `${meal.idMeal}-${i}`,
        label: meal[`strIngredient${i + 1}`],
        qty: meal[`strMeasure${i + 1}`] || "",
        unit: "",
      }))
      .filter((ing) => ing.label && ing.label.trim() !== ""),
  };

  return NextResponse.json(normalizedMeal);
}
