import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { APP_CONFIG } from "@/config/app";

// TODO(zadanie): uzupełnij nawigację o strony aplikacji.
const NAV = [
  { href: "/#jak-to-dziala", label: "Jak to działa" },
  { href: "/#asystent", label: "Asystent AI" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="truncate">{APP_CONFIG.name}</span>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            HackNation {APP_CONFIG.year}
          </Badge>
        </Link>
        <nav aria-label="Główna nawigacja" className="flex items-center gap-4 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
