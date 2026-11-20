import { APP_CONFIG } from "@/config/app";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {APP_CONFIG.year} {APP_CONFIG.teamName}
        </p>
        <p>
          Projekt przygotowany na HackNation {APP_CONFIG.year} · Zadanie:{" "}
          {APP_CONFIG.taskName}
        </p>
      </div>
    </footer>
  );
}
