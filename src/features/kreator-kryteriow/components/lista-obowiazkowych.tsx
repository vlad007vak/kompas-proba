"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Kryterium } from "@/types/ocena";

/** Kryteria obowiązkowe arkusza: nazwa w nagłówku, wskaźniki po rozwinięciu. */
export function ListaObowiazkowych({ kryteria }: { kryteria: readonly Kryterium[] }) {
  return (
    <Accordion multiple>
      {kryteria.map((k) => (
        <AccordionItem key={k.id} value={k.id}>
          <AccordionTrigger>{k.nazwa}</AccordionTrigger>
          <AccordionContent>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-muted-foreground">
              {k.wskazniki.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
