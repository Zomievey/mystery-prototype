"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Heart, Bookmark, Clock } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function RevealPage() {
  // Mock data - replace with your actual data source
  const recipe = {
    title: "Creamy Garlic Pasta",
    category: "Dinner",
    prepTime: "15 mins",
    cookTime: "20 mins",
    servings: 4,
    ingredients: [
      "8 oz fettuccine",
      "4 cloves garlic, minced",
      "2 tbsp butter",
      "1 cup heavy cream",
      "1/2 cup grated parmesan",
      "Salt & pepper to taste",
      "Fresh parsley for garnish",
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}

      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="w-full max-w-11/12 mx-auto p-4 flex items-center gap-4">
          <Link href="/" className="p-1 -ml-1 rounded-full hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Today's Recipe</h1>
          <div className="ml-auto flex gap-2">
            <button className="p-2 rounded-full hover:bg-muted/50">
              <Share2 className="h-5 w-5 cursor-pointer" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted/50">
              <Heart className="h-5 w-5 cursor-pointer" />
            </button>
            <ThemeToggle />
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
              <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                <span className="px-2 py-1 bg-primary/90 text-white rounded-full text-xs">
                  {recipe.category}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {recipe.prepTime} prep • {recipe.cookTime} cook
                  </span>
                </div>
              </div>
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
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section>
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
          </section>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-1/4 mx-auto p-4 flex gap-3">
          <button className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
            Add to Grocery List
          </button>
          <button className="p-3 rounded-lg border border-border hover:bg-muted/50">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
