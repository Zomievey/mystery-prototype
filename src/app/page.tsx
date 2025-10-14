"use client";

import { useState, useEffect } from "react";
import Countdown from "@/components/Countdown";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import AnimatedDivider from "@/components/ui/AnimatedDivider";
import { isUnlocked, todayKey } from "@/lib/reveal";
import { msUntilLocalMidnight } from "@/lib/revealTimer";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    setUnlocked(isUnlocked(todayKey()));
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

  // Only run scroll effect on client side
  useEffect(() => {
    // Set initial scroll state
    setIsScrolled(window.scrollY > 10);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors duration-300 ${isScrolled ? "shadow-sm" : ""}`}
      >
        <div className="mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="sm:hidden text-foreground p-2 -ml-2 rounded-md hover:bg-muted/50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="cursor-pointer" size={24} />
                ) : (
                  <Menu className="cursor-pointer" size={24} />
                )}
              </button>

              {/* Logo + title */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-xl font-semibold tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-200">
                  Grocery Buddy
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-8 text-sm font-medium sm:flex">
              <Link
                href="/recipes"
                className="relative text-foreground/80 hover:text-primary transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-foreground/5"
              >
                <span className="relative z-10">Recipes</span>
                <span className="absolute inset-0 bg-primary/10 rounded-md scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 -z-10"></span>
              </Link>
              <Link
                href="/list"
                className="relative text-foreground/80 hover:text-primary transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-foreground/5"
              >
                <span className="relative z-10">Grocery List</span>
                <span className="absolute inset-0 bg-primary/10 rounded-md scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 -z-10"></span>
              </Link>
              <Link
                href="/recipes/upload"
                className="relative text-foreground/80 hover:text-primary transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-foreground/5"
              >
                <span className="relative z-10">Upload Recipe</span>
                <span className="absolute inset-0 bg-primary/10 rounded-md scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 -z-10"></span>
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle className="hidden sm:block" />
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
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-6 space-y-6 mt-20">
        {unlocked ? (
          <section
            className={[
              "rounded-[14px] p-6 text-center",
              "border border-[hsl(var(--border))] bg-[hsl(var(--card))]",
              "shadow-[0_10px_30px_RGBA(0,0,0,0.08)] dark:shadow-[0_10px_30px_RGBA(0,0,0,0.25)]",
            ].join(" ")}
          >
            <p>Next meal unlocks in</p>
            <div className="text-2xl font-bold mb-2 no-theme-fade">
              <Countdown />
            </div>
            <div className="p-4">
              <AnimatedDivider remainingMs={msUntilLocalMidnight()} />
            </div>
          </section>
        ) : (
          <Link
            href="/reveal"
            className="p-1 -ml-1 rounded-full hover:bg-muted/50 block w-fit mx-auto"
          >
            <Button
              variant="unlocked"
              className="w-full sm:w-auto mx-auto flex justify-center py-3 text-lg"
            >
              Reveal today&#39;s meal
            </Button>
          </Link>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
