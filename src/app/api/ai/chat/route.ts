import { z } from "zod";

import { AiUnavailableError, streamText } from "@/lib/ai/client";

// Darmowe modele potrafią odpowiadać wolno – dajemy funkcji więcej czasu na Vercelu.
export const maxDuration = 60;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(40),
});

// TODO(zadanie): dopasuj rolę asystenta do wybranego zadania.
const SYSTEM_PROMPT = `Jesteś pomocnym asystentem w aplikacji dla obywateli.
Odpowiadasz zawsze po polsku, prostym językiem, zwięźle i rzeczowo.
Jeśli czegoś nie wiesz albo informacja może być nieaktualna, powiedz o tym wprost
i wskaż, gdzie można ją sprawdzić (np. oficjalna strona urzędu).`;

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Nieprawidłowe zapytanie." }, { status: 400 });
  }

  try {
    const { stream, provider, model } = await streamText({
      system: SYSTEM_PROMPT,
      messages: parsed.data.messages,
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-AI-Provider": provider,
        "X-AI-Model": model,
      },
    });
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      return Response.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
