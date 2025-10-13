"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Heart, Bookmark } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useGrocery } from "@/store/grocery";
import Button from "@/components/Button";
import { Recipe } from "@/types/recipe";
import { useState } from "react";

export default function RevealPage() {
  // Mock data - replace with your actual data source
  const recipe: Recipe = {
    id: "creamy-garlic-pasta",
    title: "Creamy Garlic Pasta",
    category: "Dinner",
    prepTime: "15 mins",
    cookTime: "20 mins",
    servings: 4,
    ingredients: [
      {
        id: "fettuccine",
        label: "Fettuccine",
        qty: 8,
        unit: "oz",
        aisle: "Pasta",
      },
      {
        id: "garlic",
        label: "Garlic cloves, minced",
        qty: 4,
        unit: "cloves",
        aisle: "Produce",
      },
      { id: "butter", label: "Butter", qty: 2, unit: "tbsp", aisle: "Dairy" },
      {
        id: "heavy-cream",
        label: "Heavy cream",
        qty: 1,
        unit: "cup",
        aisle: "Dairy",
      },
      {
        id: "parmesan",
        label: "Parmesan, grated",
        qty: 0.5,
        unit: "cup",
        aisle: "Dairy",
      },
      { id: "salt", label: "Salt", qty: 1, unit: "pinch" },
      { id: "pepper", label: "Black pepper", qty: 1, unit: "pinch" },
      {
        id: "parsley",
        label: "Fresh parsley",
        qty: 1,
        unit: "tbsp",
        aisle: "Produce",
      },
    ],
    instructions: [
      "Cook pasta according to package instructions.",
      "In a large pan, melt butter over medium heat. Add garlic and sauté until fragrant.",
      "Pour in heavy cream and bring to a simmer.",
      "Add parmesan cheese and stir until melted and smooth.",
      "Drain pasta and add to the sauce, tossing to coat.",
      "Season with salt and pepper to taste.",
      "Garnish with fresh parsley before serving.",
    ],
    image: "/images/garlic-pasta.jpg",
  };

  const addRecipe = useGrocery((s) => s.addRecipe);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddRecipe = () => {
    addRecipe(recipe);
    setIsAdded(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}

      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="w-full max-w-11/12 mx-auto p-4 flex items-center gap-4">
          <Link href="/" className="p-1 -ml-1 rounded-full hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Home</h1>
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

      <main className="max-w-4xl mx-auto pb-20">
        {/* Recipe Image */}
        <div className="relative aspect-[4/3] w-full bg-muted/20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${recipe.image})` }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="text-2xl font-bold text-white">{recipe.title}</h2>
            </div>
          </motion.div>
        </div>

        {/* Recipe Meta */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-3 bg-card rounded-lg">
              <div className="text-sm text-muted">Prep</div>
              <div className="font-medium">{recipe.prepTime}</div>
            </div>
            <div className="p-3 bg-card rounded-lg">
              <div className="text-sm text-muted">Cook</div>
              <div className="font-medium">{recipe.cookTime}</div>
            </div>
            <div className="p-3 bg-card rounded-lg">
              <div className="text-sm text-muted">Servings</div>
              <div className="font-medium">{recipe.servings}</div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="grid md:grid-cols-3 gap-6 flex items-center px-8 py-6">
            {/* Instructions */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <ol className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium">
                      {i + 1}
                    </div>
                    <p className="text-foreground/90">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                    <span>
                      {ingredient.qty} {ingredient.unit} {ingredient.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-1/4 mx-auto p-4 flex gap-3">
          {isAdded ? (
            <Link href="/list" className="flex-1">
              <Button className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                View Grocery List
              </Button>
            </Link>
          ) : (
            <Button
              className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              onClick={handleAddRecipe}
            >
              Add to Grocery List
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
