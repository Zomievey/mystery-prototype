"use client";
import { notFound } from "next/navigation";
import Image from "next/image";

import { ArrowLeft, Heart, Share2, Bookmark, Clock } from "lucide-react";
import Link from "next/link";
import { useGrocery } from "@/store/grocery";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import recipesData from "@/../public/data/recipes.json";

export default function RecipeDetail({ params }: { params: { id: string } }) {
  const recipe = recipesData.find((r) => r.id === params.id);
  const addRecipe = useGrocery((s) => s.addRecipe);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddRecipe = () => {
    if (!recipe) return;
    addRecipe(recipe, recipe.servings);
    setIsAdded(true);
  };

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="w-full max-w-11/12 mx-auto p-4 flex items-center gap-4">
          <Link
            href="/recipes"
            className="p-1 -ml-1 rounded-full hover:bg-muted/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Back to recipes</h1>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleAddRecipe}
              disabled={isAdded}
              className={`p-2 rounded-full hover:bg-muted/50 ${isAdded ? "text-green-500" : ""}`}
              title={isAdded ? "Added to list" : "Add to grocery list"}
            >
              <Bookmark
                className="h-5 w-5 cursor-pointer"
                fill={isAdded ? "currentColor" : "none"}
              />
            </button>
            <button className="p-2 rounded-full hover:bg-muted/50">
              <Heart className="h-5 w-5 cursor-pointer" />
            </button>{" "}
            <button className="p-2 rounded-full hover:bg-muted/50">
              <Share2 className="h-5 w-5 cursor-pointer" />
            </button>
            <div className="mt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-9/12 mx-auto pb-20">
        {/* Recipe Image */}
        <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
          {recipe.image && (
            <div className="relative h-64 w-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-2xl font-bold text-white">
                  {recipe.title}
                </h2>{" "}
                <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {recipe.prepTime} prep • {recipe.cookTime} cook •{" "}
                      {recipe.servings} servings
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 flex items-center px-8 py-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {i + 1}
                    </span>
                    <p className="text-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>
                      <span className="font-medium">
                        {ingredient.qty} {ingredient.unit}{" "}
                      </span>
                      {ingredient.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <Footer />
    </div>
  );
}
