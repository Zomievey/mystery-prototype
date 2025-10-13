"use client";
import { useGrocery } from "@/store/grocery";
import recipesData from "@/../public/data/recipes.json";
import Button from "@/components/Button";
import { Trash2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

export default function ListPage() {
  const { items, toggle, removeItem, clear } = useGrocery();

  const groups = Object.values(items).reduce<
    Record<string, (typeof items)[string][]>
  >((acc, it) => {
    const group = it.aisle ?? "Other";
    (acc[group] ||= []).push(it);
    return acc;
  }, {});

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
      <main className="flex-1 mx-auto w-full max-w-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Grocery List</h1>
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
        </div>

        {Object.keys(groups).length === 0 ? (
          <p className="text-center text-[hsl(var(--muted-fg))]">
            Your list is empty.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groups).map(([aisle, list]) => (
              <section key={aisle}>
                <h2 className="text-sm font-medium mb-2 opacity-70">{aisle}</h2>
                <ul className="divide-y divide-[hsl(var(--border))] rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                  {list.map((item) => (
                    <li key={item.key} className="flex items-center gap-3 p-3">
                      <button
                        onClick={() => toggle(item.key)}
                        className={`h-5 w-5 rounded border border-[hsl(var(--border))] grid place-items-center ${
                          item.checked
                            ? "bg-[hsl(var(--primary))] text-white"
                            : "bg-transparent"
                        }`}
                        aria-label={`Toggle ${item.label}`}
                      >
                        {item.checked && <Check className="h-3.5 w-3.5" />}
                      </button>
                      <div className="flex-1">
                        <div
                          className={`text-md ${item.checked ? "opacity-50 line-through" : ""}`}
                        >
                          {item.label}
                        </div>
                        <div className="text-sm opacity-70">
                          {item.sources
                            .map((source) => {
                              const recipe = recipesData.find(
                                (r) => r.id === source.recipeId,
                              );
                              return recipe?.title || "Unknown Recipe";
                            })
                            .join(", ")}
                        </div>
                        <div className="text-xs opacity-70">
                          {item.qty}
                          {item.unit ? ` ${item.unit}` : ""}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="p-2 rounded hover:bg-[hsl(var(--card))/0.6]"
                      >
                        <Trash2 className="h-4 w-4 opacity-70" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Fixed Bottom Action Bar */}
      <Footer />
    </div>
  );
}
