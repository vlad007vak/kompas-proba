import dane from "@/data/kryteria-oceny.json";
import type { Arkusz, ArkuszTyp, Kryterium, OcenaCzastkowa, PoziomOceny } from "@/types/ocena";

/**
 * Oficjalny katalog kryteriów oceny okresowej (załącznik nr 1 do Dz.U. 2016 poz. 470)
 * oraz arkusze A/B/C z kryteriami obowiązkowymi (§ 3–4).
 */

export const ZRODLO_PRAWNE = dane.zrodlo;
export const ZRODLO_URL = dane.zrodlo_url;

/** Maksymalna liczba kryteriów dodatkowych wybieranych przez oceniającego (§ 5 ust. 2). */
export const MAX_KRYTERIOW_DODATKOWYCH = dane.max_kryteriow_dodatkowych;

export const KRYTERIA: readonly Kryterium[] = dane.kryteria;

const TYPY: readonly ArkuszTyp[] = ["A", "B", "C"];

export const ARKUSZE: Readonly<Record<ArkuszTyp, Arkusz>> = Object.fromEntries(
  TYPY.map((typ) => [typ, { typ, ...dane.arkusze[typ] }]),
) as Record<ArkuszTyp, Arkusz>;

/** Skala ocen cząstkowych (§ 11 ust. 1 pkt 1). */
export const SKALA_CZASTKOWA = dane.skala_czastkowa as readonly {
  punkty: OcenaCzastkowa;
  poziom: PoziomOceny;
}[];

const KRYTERIA_PO_ID = new Map(KRYTERIA.map((k) => [k.id, k]));

export function getKryterium(id: string): Kryterium | undefined {
  return KRYTERIA_PO_ID.get(id);
}

export function isArkuszTyp(value: string): value is ArkuszTyp {
  return (TYPY as readonly string[]).includes(value);
}

/** Kryteria obowiązkowe dla arkusza, w kolejności z rozporządzenia. */
export function kryteriaObowiazkowe(typ: ArkuszTyp): Kryterium[] {
  return ARKUSZE[typ].obowiazkowe.flatMap((id) => getKryterium(id) ?? []);
}

/** Kryteria, które oceniający może wybrać jako dodatkowe (wszystkie poza obowiązkowymi). */
export function kryteriaDodatkowe(typ: ArkuszTyp): Kryterium[] {
  const obowiazkowe = new Set(ARKUSZE[typ].obowiazkowe);
  return KRYTERIA.filter((k) => !obowiazkowe.has(k.id));
}
