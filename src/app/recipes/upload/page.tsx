"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Upload, Loader2 } from "lucide-react";
import { parseRecipeFromText, processImageUpload } from "@/lib/ocrParser";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function UploadRecipePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{
    status: string;
    progress: number;
  }>({ status: "idle", progress: 0 });
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image file");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress({ status: "Initializing OCR engine...", progress: 0 });

    try {
      // Step 1: Process the image with OCR
      const ocrText = await processImageUpload(file, (progress) => {
        setProgress(progress);
      });

      setProgress({ status: "Parsing recipe...", progress: 80 });

      // Step 2: Parse the OCR text into a recipe
      const recipe = await parseRecipeFromText(ocrText);

      setProgress({ status: "Finalizing...", progress: 95 });

      // Step 3: Navigate to the edit page with the parsed recipe
        sessionStorage.setItem("newRecipe", JSON.stringify(recipe));
        router.push("/recipes/new");

    } catch (err) {
      console.error("Error processing recipe:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process the image. Please try again with a clearer image.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
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
                className="relative text-foreground/80 hover:text-foreground transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-foreground/5"
              >
                <span className="relative">Grocery List</span>
              </Link>
              <Link
                href="/recipes/upload"
                className="relative text-foreground/80 hover:text-foreground transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-foreground/5 bg-foreground/5"
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
                  className="flex items-center px-4 py-2.5 text-[15px] font-medium text-foreground/90 hover:bg-foreground/5 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Grocery List</span>
                </Link>
                <Link
                  href="/recipes/upload"
                  className="flex items-center px-4 py-2.5 text-[15px] font-medium text-foreground/90 bg-foreground/5 rounded-lg"
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
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6 mt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Upload Recipe</h1>
          <p className="text-muted-foreground">
            Upload an image of a recipe to get started
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">
                Recipe Image
              </label>
              <div className="mt-1">
                <label
                  htmlFor="recipe-image"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-foreground/5 transition-colors ${
                    isProcessing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {preview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain p-4 rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <Upload className="h-10 w-10 text-foreground/50 mb-2" />
                      <p className="text-sm text-foreground/70">
                        <span className="font-medium text-primary">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-foreground/50 mt-1">
                        JPG, PNG, or WEBP (MAX. 10MB)
                      </p>
                    </div>
                  )}
                  <input
                    id="recipe-image"
                    name="recipe-image"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                  />
                </label>
                <p className="mt-2 text-sm text-foreground/60">
                  {file ? file.name : "No file selected"}
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive dark:text-destructive-foreground p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {isProcessing && (
              <div className="space-y-3">
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">{progress.status}</span>
                  <span className="font-medium">
                    {Math.round(progress.progress)}%
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={!file || isProcessing}
                className="w-full sm:w-auto"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {progress.progress < 100
                      ? "Processing..."
                      : "Almost done..."}
                  </>
                ) : (
                  <>Process Recipe</>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-lg">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-medium mb-1">Tips for best results</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Use a clear photo of a printed recipe</li>
                <li>Ensure good lighting and minimal shadows</li>
                <li>Handwritten recipes may not be as accurate</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
