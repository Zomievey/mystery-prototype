"use client";
import Image from "next/image";
import { m } from "framer-motion";
import type { Recipe } from "@/types/recipe";
import Button from "@/components/Button";
import Link from "next/link";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const src = recipe.image?.startsWith("//")
    ? `https:${recipe.image}`
    : recipe.image;

  return (
    <Link href={`/recipes/${String(recipe.id)}`} className="block">
      <m.article
        whileHover={{ y: -2 }}
        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm overflow-hidden h-full flex flex-col"
      >
        {src && (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={src}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              // unoptimized // <- TEMP if you still hit config issues
            />
          </div>
        )}

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold">{recipe.title}</h3>
            <p className="text-xs text-[hsl(var(--muted-fg))]">
              {recipe.category ?? "Recipe"}
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" className="px-3">
              View Recipe
            </Button>
          </div>
        </div>
      </m.article>
    </Link>
  );
}
