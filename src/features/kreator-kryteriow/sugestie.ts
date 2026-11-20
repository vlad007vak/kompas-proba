import "server-only";

import { generateJson } from "@/lib/ai/client";
import { kryteriaDodatkowe, MAX_KRYTERIOW_DODATKOWYCH } from "@/lib/kryteria";
import type { ArkuszTyp, SugestiaKryterium } from "@/types/ocena";

import { SYSTEM_PROMPT, zbudujPytanie } from "./prompt";
import { oczyscSugestie, odpowiedzModeluSchema } from "./walidacja";

/** Prosi AI o maksymalnie 3 kryteria dodatkowe i odrzuca wszystko spoza dozwolonej listy. */
export async function zaproponujKryteria(
  opisStanowiska: string,
  arkusz: ArkuszTyp,
): Promise<{ sugestie: SugestiaKryterium[]; provider: string; model: string }> {
  const dozwolone = kryteriaDodatkowe(arkusz);

  const { data, provider, model } = await generateJson(odpowiedzModeluSchema, {
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: zbudujPytanie(opisStanowiska, arkusz, dozwolone) }],
    temperature: 0.2,
    maxTokens: 800,
  });

  const sugestie = oczyscSugestie(
    data.sugestie,
    new Set(dozwolone.map((k) => k.id)),
    MAX_KRYTERIOW_DODATKOWYCH,
  );
  return { sugestie, provider, model };
}
