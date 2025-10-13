import recipes from "@/../public/data/recipes.json"; // static import in Next
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

export default function RecipesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="w-full max-w-11/12 mx-auto p-4 flex items-center gap-4">
          <Link href="/" className="p-1 -ml-1 rounded-full hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Home</h1>
          <div className="ml-auto flex gap-2">
            <div className="mt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Browse recipes</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {(recipes as any[]).map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </main>
      {/* Fixed Bottom Action Bar */}
      <Footer />
    </div>
  );
}
