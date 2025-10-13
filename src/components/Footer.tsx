export default function Footer() {
  return (
    <footer className="bg-background/95 backdrop-blur-sm border-t border-border py-3">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Mystery Meal
        </p>
      </div>
    </footer>
  );
}
