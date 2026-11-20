import "server-only";

/**
 * Konfiguracja darmowych dostawców AI.
 * Wszyscy mówią protokołem OpenAI-compatible, więc wystarczy jeden klient.
 *
 * Kolejność prób: AI_PROVIDER_ORDER (domyślnie groq,gemini,ollama).
 * Kilka kluczy jednego dostawcy podaj po przecinku (np. klucze kilku osób z zespołu)
 * – przy limicie (429) klient przejdzie do następnego klucza.
 */

export type ProviderId = "groq" | "gemini" | "ollama";

export interface AiProvider {
  /** Unikalna nazwa wpisu, np. "groq#2" */
  name: string;
  id: ProviderId;
  baseURL: string;
  apiKey: string;
  model: string;
}

const PROVIDER_IDS: readonly ProviderId[] = ["groq", "gemini", "ollama"];

const DEFAULTS: Record<ProviderId, { baseURL: string; model: string }> = {
  groq: {
    baseURL: "https://api.groq.com/openai/v1",
    model: "qwen/qwen3.8-27b",
  },
  gemini: {
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    model: "gemini-3.5-flash-lite",
  },
  ollama: {
    baseURL: "http://localhost:11434/v1",
    model: "",
  },
};

function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isProviderId(value: string): value is ProviderId {
  return (PROVIDER_IDS as readonly string[]).includes(value);
}

function entriesFor(id: ProviderId): AiProvider[] {
  const env = process.env;

  if (id === "ollama") {
    // Ollama działa tylko lokalnie – włączamy go jedynie, gdy podano model.
    const model = env.OLLAMA_MODEL?.trim();
    if (!model) return [];
    return [
      {
        name: "ollama",
        id,
        baseURL: env.OLLAMA_BASE_URL?.trim() || DEFAULTS.ollama.baseURL,
        apiKey: "ollama",
        model,
      },
    ];
  }

  const keys = splitList(id === "groq" ? env.GROQ_API_KEY : env.GEMINI_API_KEY);
  const model =
    (id === "groq" ? env.GROQ_MODEL : env.GEMINI_MODEL)?.trim() ||
    DEFAULTS[id].model;

  return keys.map((apiKey, i) => ({
    name: keys.length > 1 ? `${id}#${i + 1}` : id,
    id,
    baseURL: DEFAULTS[id].baseURL,
    apiKey,
    model,
  }));
}

/** Lista skonfigurowanych dostawców w kolejności prób. */
export function getProviders(): AiProvider[] {
  const order = splitList(process.env.AI_PROVIDER_ORDER).filter(isProviderId);
  const ids = order.length > 0 ? order : [...PROVIDER_IDS];
  return ids.flatMap(entriesFor);
}

/** Bezpieczny opis dostawcy (bez klucza) – można pokazać w UI. */
export function describeProvider(p: AiProvider) {
  return { name: p.name, id: p.id, model: p.model };
}
