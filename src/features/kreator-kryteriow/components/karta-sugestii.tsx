import { SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Kryterium } from "@/types/ocena";

/** Karta propozycji AI: nazwa kryterium, uzasadnienie i wskaźniki behawioralne. */
export function KartaSugestii({
  kryterium,
  uzasadnienie,
}: {
  kryterium: Kryterium;
  uzasadnienie: string;
}) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="secondary">
          <SparklesIcon aria-hidden />
          Propozycja AI
        </Badge>
        <CardTitle>{kryterium.nazwa}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p>
          <span className="font-medium">Uzasadnienie: </span>
          {uzasadnienie}
        </p>
        <div>
          <p className="mb-1 font-medium">Wskaźniki behawioralne</p>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-muted-foreground">
            {kryterium.wskazniki.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
