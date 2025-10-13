"use client";
import Image from "next/image";
import { m } from "framer-motion";
import type { Recipe } from "@/types/recipe";
import Button from "@/components/Button";
import Link from "next/link";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <m.article
        whileHover={{ y: -2 }}
        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm overflow-hidden h-full flex flex-col"
      >
        {recipe.image && (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
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
