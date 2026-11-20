import type { Metadata } from "next";

import { KreatorKryteriow } from "@/features/kreator-kryteriow/components/kreator-kryteriow";

export const metadata: Metadata = {
  title: "Kreator kryteriów",
  description:
    "Kryteria obowiązkowe dla arkusza A, B lub C oraz propozycje AI kryteriów dodatkowych do oceny okresowej w służbie cywilnej.",
};

export default function KreatorPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Kreator kryteriów oceny</h1>
        <p className="max-w-3xl text-muted-foreground">
          Wklej opis obowiązków pracownika i wybierz typ arkusza. Pokażemy kryteria obowiązkowe, a AI
          zaproponuje kryteria dodatkowe z oficjalnego katalogu – każde z krótkim uzasadnieniem.
          Decyzję podejmujesz Ty.
        </p>
      </header>
      <KreatorKryteriow />
    </div>
  );
}
