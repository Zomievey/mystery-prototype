"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { useRecipesSearch } from "@/hooks/useRecipesSearch";
import localRecipes from "@/../public/data/recipes.json";

export default function RecipesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after mount to avoid hydration issues
  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Search debounce
  useEffect(() => {
    const id = setTimeout(() => setQ(text.trim()), 350);
    return () => clearTimeout(id);
  }, [text]);

  const { data, isLoading, isFetching, isError } = useRecipesSearch(q);

  // Fallback to local JSON if remote returns empty
  const results = useMemo(() => {
    if (isError) return localRecipes as unknown[];
    if (!data || data.length === 0) return localRecipes as unknown[];
    return data;
  }, [data, isError]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors duration-300 ${
          isClient && isScrolled ? "shadow-sm" : ""
        }`}
        style={{
          // Ensure consistent background for initial render
          backgroundColor: "hsl(var(--background) / 0.8)",
          backdropFilter: "blur(8px)",
        }}
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
                className="relative text-foreground/80 hover:text-foreground transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-foreground/5"
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
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 -mr-1 rounded-md hover:bg-foreground/5"
                aria-label="Search recipes"
              >
                <Search className="h-5 w-5 cursor-pointer" />
              </button>
              <ThemeToggle className="hidden md:block" />
            </div>
          </div>

          {/* Search bar */}
          <div
            className={`transition-all duration-350 overflow-hidden ${searchOpen ? "max-h-24 pb-6 pt-3" : "max-h-0 py-0"}`}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search recipes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-border/50 bg-background/80 text-sm focus:outline-none focus:ring-0 focus:border-transparent hover:border-foreground/30 relative focus:before:content-[''] focus:before:absolute focus:before:inset-0 focus:before:rounded-lg focus:before:border-2 focus:before:border-ring/50 focus:before:pointer-events-none"
              />
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
                  className="flex items-center px-4 py-2.5 text-[15px] font-medium text-foreground/90 hover:bg-foreground/5 rounded-lg transition-colors duration-200"
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

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 space-y-6 mt-24">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Recipes</h1>
          {isFetching && (
            <span className="text-sm text-muted">Searching...</span>
          )}
        </div>

        {q && !isLoading && !isError && (
          <p className="text-sm text-muted">
            {results.length} results for &quot;{q}&quot;
          </p>
        )}

        {isLoading ? (
          <SkeletonGrid />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
            {results.map((r: any) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-4 animate-pulse"
        >
          <div className="aspect-video w-full rounded-lg bg-foreground/5 mb-3" />
          <div className="h-5 w-3/4 bg-foreground/10 rounded mb-2" />
          <div className="h-4 w-1/2 bg-foreground/10 rounded" />
        </div>
      ))}
    </div>
  );
}
