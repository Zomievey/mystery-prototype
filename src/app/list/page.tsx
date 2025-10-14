"use client";
import { useGrocery } from "@/store/grocery";
import recipesData from "@/../public/data/recipes.json";
import Button from "@/components/Button";
import { Trash2, Check, Menu, X } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

// Only render on client-side to prevent hydration issues
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

export default function GroceryList() {
  const isClient = useIsClient();
  const { items, toggle, removeItem, clear } = useGrocery();

  const groups = Object.values(items).reduce<
    Record<string, (typeof items)[string][]>
  >((acc, it) => {
    const group = it.aisle ?? "Other";
    (acc[group] ||= []).push(it);
    return acc;
  }, {});

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header - only on client
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest(".mobile-menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  if (!isClient) {
    // Show minimal content during SSR/SSG
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <div className="invisible">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors duration-300 ${isScrolled ? "shadow-sm" : ""}`}
      >
        <div className="mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden text-foreground p-2 -ml-2 rounded-md hover:bg-foreground/5"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="cursor-pointer" size={20} />
                ) : (
                  <Menu className="cursor-pointer" size={20} />
                )}
              </button>

              {/* Logo + title */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-xl font-semibold tracking-tight text-foreground/90">
                  Grocery Buddy
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-8 text-sm font-medium md:flex">
              <Link
                href="/recipes"
                className="relative text-foreground/80 hover:text-foreground transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-foreground/5"
              >
                <span className="relative">Recipes</span>
              </Link>
              <Link
                href="/list"
                className="relative text-foreground/80 hover:text-foreground transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-foreground/5 bg-foreground/5"
              >
                <span className="relative">Grocery List</span>
              </Link>
              <Link
                href="/recipes/upload"
                className="relative text-foreground/80 hover:text-foreground transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-foreground/5"
              >
                <span className="relative">Upload Recipe</span>
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle className="hidden md:block" />
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              isMenuOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="border-t border-border bg-background/95 backdrop-blur-xl">
              <nav className="px-1 py-2 space-y-1">
                <Link
                  href="/recipes"
                  className="flex items-center px-4 py-2.5 text-[15px] font-medium text-foreground/90 hover:bg-foreground/5 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Recipes</span>
                </Link>
                <Link
                  href="/list"
                  className="flex items-center px-4 py-2.5 text-[15px] font-medium text-foreground/90 bg-foreground/5 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Grocery List</span>
                </Link>
                <Link
                  href="/recipes/upload"
                  className="flex items-center px-4 py-2.5 text-[15px] font-medium text-foreground/90 hover:bg-foreground/5 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Upload Recipe</span>
                </Link>
              </nav>
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
