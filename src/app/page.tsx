import Countdown from "@/components/Countdown";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Share2 } from "lucide-react";

export default function Home() {
  const unlocked = false;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="mx-auto w-full max-w-[91.6667%] p-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-card border border-border grid place-items-center shadow-sm">
              <span className="text-xs font-bold tracking-wide">MM</span>
            </div>
            <h1 className="text-xl font-semibold">Mystery Meal</h1>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-6 space-y-6">
        {/* Countdown / CTA */}
        {!unlocked ? (
          <section
            className={[
              "rounded-[14px] p-6 text-center",
              "border border-[hsl(var(--border))] bg-[hsl(var(--card))]",
              "shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
            ].join(" ")}
          >
            <p className="text-sm text-[hsl(var(--muted-fg))] mb-2">
              Next meal unlocks in
            </p>
            <div className="text-2xl font-bold mb-2 no-theme-fade">
              <Countdown />
            </div>
          </section>
        ) : (
          <Button className="w-full py-3 text-lg">Reveal today’s meal</Button>
        )}

        {/* Grocery List Preview */}
        <section
          className={[
            "rounded-[14px] p-6",
            "border border-[hsl(var(--border))] bg-[hsl(var(--card))]",
            "shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
          ].join(" ")}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Grocery List</h2>
            <span className="text-sm text-[hsl(var(--muted-fg))]">Today</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <p className="py-20 text-sm text-center text-[hsl(var(--muted-fg))]">
                Your grocery list is empty
              </p>
            </div>
          </div>

          <div className=" max-w-1/3 mx-auto mt-6 flex gap-3">
            <Button className="flex-1">Start Adding Items</Button>
            <Button variant="outline" className="px-4" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background/95 backdrop-blur-sm border-t border-border py-3">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Mystery Meal
          </p>
        </div>
      </footer>
    </div>
  );
}
