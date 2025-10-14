import { notFound } from "next/navigation";
import RecipeDetailClient from "./RecipeDetailClient";
import { normalizeMealDBRecipe } from "@/lib/recipeUtils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage({
  params: paramsPromise,
}: PageProps) {
  // Await the params to ensure they're available
  const params = await paramsPromise;

  // First try to find the recipe in local data
  const localRecipes = (await import("@/../public/data/recipes.json")).default;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localRecipe = localRecipes.find((r: any) => r.id === params.id);

  if (localRecipe) {
    return <RecipeDetailClient recipe={localRecipe} />;
  }

  // If not found locally, try to fetch from TheMealDB
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.id}`,
      {
        next: { revalidate: 60 * 60 * 24 }, // Cache for 24 hours
      },
    );

    if (!res.ok) throw new Error("Failed to fetch recipe");

    const data = await res.json();

    if (!data?.meals?.[0]) {
      notFound();
    }

    const recipe = normalizeMealDBRecipe(data.meals[0]);

    return <RecipeDetailClient recipe={recipe} />;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    notFound();
  }
}
