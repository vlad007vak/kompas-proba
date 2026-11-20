import { z } from "zod";

import type { SugestiaKryterium } from "@/types/ocena";

/** Odpowiedź modelu dla generateJson (top-level musi być obiektem). Elementy sprawdzamy osobno. */
export const odpowiedzModeluSchema = z.object({
  sugestie: z.array(z.unknown()),
});

const surowaSugestiaSchema = z.object({
  kryteriumId: z.string(),
  uzasadnienie: z.string(),
});

const MAX_DLUGOSC_UZASADNIENIA = 500;

/**
 * Nie ufamy modelowi: zostawiamy tylko dozwolone id (istniejące i nieobowiązkowe dla arkusza),
 * bez duplikatów, z niepustym uzasadnieniem i najwyżej `max` pozycji.
 */
export function oczyscSugestie(
  surowe: readonly unknown[],
  dozwoloneIds: ReadonlySet<string>,
  max: number,
): SugestiaKryterium[] {
  const wynik: SugestiaKryterium[] = [];
  const uzyte = new Set<string>();

  for (const item of surowe) {
    if (wynik.length >= max) break;
    const parsed = surowaSugestiaSchema.safeParse(item);
    if (!parsed.success) continue;

    const kryteriumId = parsed.data.kryteriumId.trim();
    let uzasadnienie = parsed.data.uzasadnienie.trim();
    if (!dozwoloneIds.has(kryteriumId) || uzyte.has(kryteriumId) || !uzasadnienie) continue;
    if (uzasadnienie.length > MAX_DLUGOSC_UZASADNIENIA) {
      uzasadnienie = `${uzasadnienie.slice(0, MAX_DLUGOSC_UZASADNIENIA).trimEnd()}…`;
    }

    uzyte.add(kryteriumId);
    wynik.push({ kryteriumId, uzasadnienie });
  }

  return wynik;
}
