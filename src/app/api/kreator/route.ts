import { kreatorRequestSchema } from "@/features/kreator-kryteriow/schema";
import { zaproponujKryteria } from "@/features/kreator-kryteriow/sugestie";
import { AiUnavailableError } from "@/lib/ai/client";

// Darmowe modele potrafią odpowiadać wolno – dajemy funkcji więcej czasu na Vercelu.
export const maxDuration = 60;

/** POST /api/kreator → { sugestie: SugestiaKryterium[] } (0–3 kryteria dodatkowe). */
export async function POST(request: Request) {
  const parsed = kreatorRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? "Nieprawidłowe zapytanie.";
    return Response.json({ error }, { status: 400 });
  }

  try {
    const { sugestie, provider, model } = await zaproponujKryteria(
      parsed.data.opisStanowiska,
      parsed.data.arkusz,
    );
    return Response.json(
      { sugestie },
      { headers: { "X-AI-Provider": provider, "X-AI-Model": model } },
    );
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      return Response.json({ error: err.message }, { status: 503 });
    }
    console.error("[kreator]", err);
    return Response.json(
      { error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie." },
      { status: 500 },
    );
  }
}
