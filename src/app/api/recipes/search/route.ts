//search/route.ts
import { NextResponse } from "next/server";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(meal: any) {
  const ingredients = Array.from({ length: 20 })
    .map((_, i) => {
      const ing = meal[`strIngredient${i + 1}`];
      const meas = meal[`strMeasure${i + 1}`];
      if (!ing || !String(ing).trim()) return null;
      return {
        id: `${meal.idMeal}-${i + 1}`,
        label: String(ing).trim(),
        qty: meas ? String(meas).trim() : "",
        unit: "", // keep Ingredient.unit?: string in your types
      };
    })
    .filter(Boolean);

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory || "Other",
    prepTime: null, // TheMealDB doesn’t provide times
    cookTime: null,
    servings: 2,
    ingredients,
    instructions: (meal.strInstructions || "")
      .split(/\r?\n/)
      .map((s: string) => s.trim())
      .filter(Boolean),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const url = q
    ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`
    : `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

  const res = await fetch(url, { next: { revalidate: 60 } }); // cache 60s on the server
  if (!res.ok) return NextResponse.json({ results: [] }, { status: 200 });

  const json = await res.json();
  const meals = json?.meals ?? [];
  const results = meals.map(normalize);

  return NextResponse.json({ results });
}
