import { connection } from "next/server";

import { checkProviders } from "@/lib/ai/client";
import { describeProvider, getProviders } from "@/lib/ai/providers";

export const maxDuration = 60;

/** Lista skonfigurowanych dostawców (bez kluczy). */
export async function GET() {
  // Konfiguracja czytana przy każdym żądaniu, a nie zamrożona w czasie builda.
  await connection();
  return Response.json({ providers: getProviders().map(describeProvider) });
}

/** Test połączenia z każdym dostawcą. */
export async function POST() {
  const results = await checkProviders();
  return Response.json({ results });
}
