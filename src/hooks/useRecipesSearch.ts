"use client";
import { useQuery } from "@tanstack/react-query";

export type RecipeListItem = {
  id: string;
  title: string;
  image?: string;
  category?: string;
  // …keep lightweight; detail page can refetch by id if needed
};

export function useRecipesSearch(q: string) {
  return useQuery({
    queryKey: ["recipes-search", q],
    queryFn: async () => {
      const res = await fetch(`/api/recipes/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Failed to search");
      const data = await res.json();
      return data.results as RecipeListItem[];
    },
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}
