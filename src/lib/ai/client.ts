import "server-only";

import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { z } from "zod";

import { getProviders, type AiProvider } from "./providers";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface AiRequest {
  /** Instrukcja systemowa (rola, styl, język odpowiedzi). */
  system?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AiTextResult {
  text: string;
  provider: string;
  model: string;
}

export class AiUnavailableError extends Error {
  constructor(public readonly attempts: string[]) {
    super(
      attempts.length === 0
        ? "Brak skonfigurowanego dostawcy AI. Uzupełnij klucze w pliku .env.local."
        : "Żaden dostawca AI nie odpowiedział. Spróbuj ponownie za chwilę.",
    );
    this.name = "AiUnavailableError";
  }
}

const REQUEST_TIMEOUT_MS = 60_000;

function clientFor(p: AiProvider) {
  // maxRetries: 0 – zamiast czekać na ponowienia, od razu próbujemy kolejnego dostawcy.
  return new OpenAI({
    apiKey: p.apiKey,
    baseURL: p.baseURL,
    maxRetries: 0,
    timeout: REQUEST_TIMEOUT_MS,
  });
}

function toMessages(req: AiRequest): ChatCompletionMessageParam[] {
  const msgs: ChatCompletionMessageParam[] = [];
  if (req.system) msgs.push({ role: "system", content: req.system });
  for (const m of req.messages) msgs.push({ role: m.role, content: m.content });
  return msgs;
}

function describeError(p: AiProvider, err: unknown): string {
  // APIError.message zawiera już kod HTTP (np. "401 Invalid API Key").
  const msg = err instanceof Error ? err.message : String(err);
  return `${p.name} (${p.model}): ${msg}`.slice(0, 300);
}

/**
 * Próbuje kolejnych dostawców, aż któryś odpowie.
 * Rzuca AiUnavailableError, gdy wszyscy zawiodą.
 */
async function withFallback<T>(
  run: (client: OpenAI, p: AiProvider) => Promise<T>,
): Promise<T> {
  const providers = getProviders();
  const attempts: string[] = [];

  for (const p of providers) {
    try {
      return await run(clientFor(p), p);
    } catch (err) {
      const line = describeError(p, err);
      attempts.push(line);
      console.warn(`[ai] ${line}`);
    }
  }
  throw new AiUnavailableError(attempts);
}

/** Zwykła odpowiedź tekstowa (bez strumieniowania). */
export async function generateText(req: AiRequest): Promise<AiTextResult> {
  return withFallback(async (client, p) => {
    const res = await client.chat.completions.create({
      model: p.model,
      messages: toMessages(req),
      temperature: req.temperature ?? 0.3,
      max_tokens: req.maxTokens,
    });
    const text = res.choices[0]?.message?.content ?? "";
    if (!text.trim()) throw new Error("Pusta odpowiedź modelu");
    return { text, provider: p.name, model: p.model };
  });
}

/**
 * Odpowiedź strumieniowana jako czysty tekst (UTF-8).
 * Błędy limitu/klucza pojawiają się przy create(), więc fallback działa przed startem strumienia.
 */
export async function streamText(req: AiRequest): Promise<{
  stream: ReadableStream<Uint8Array>;
  provider: string;
  model: string;
}> {
  return withFallback(async (client, p) => {
    const completion = await client.chat.completions.create({
      model: p.model,
      messages: toMessages(req),
      temperature: req.temperature ?? 0.3,
      max_tokens: req.maxTokens,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (err) {
          console.warn(`[ai] przerwany strumień ${describeError(p, err)}`);
          controller.enqueue(encoder.encode("\n\n[Połączenie z AI zostało przerwane]"));
        } finally {
          controller.close();
        }
      },
      cancel() {
        completion.controller.abort();
      },
    });

    return { stream, provider: p.name, model: p.model };
  });
}

export interface ProviderCheck {
  name: string;
  model: string;
  ok: boolean;
  latencyMs: number;
  detail: string;
}

/** Sprawdza każdego dostawcę osobno krótkim zapytaniem (bez fallbacku). */
export async function checkProviders(): Promise<ProviderCheck[]> {
  return Promise.all(
    getProviders().map(async (p) => {
      const started = Date.now();
      try {
        const res = await clientFor(p).chat.completions.create({
          model: p.model,
          messages: [{ role: "user", content: "Odpowiedz jednym słowem: działa?" }],
          max_tokens: 10,
        });
        return {
          name: p.name,
          model: p.model,
          ok: true,
          latencyMs: Date.now() - started,
          detail: (res.choices[0]?.message?.content ?? "").trim().slice(0, 50),
        };
      } catch (err) {
        return {
          name: p.name,
          model: p.model,
          ok: false,
          latencyMs: Date.now() - started,
          detail: describeError(p, err),
        };
      }
    }),
  );
}

/** Wyciąga JSON z odpowiedzi modelu (także z bloku ```json ... ```). */
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced ? fenced[1] : text).trim();
  const start = raw.search(/[[{]/);
  const end = Math.max(raw.lastIndexOf("}"), raw.lastIndexOf("]"));
  if (start === -1 || end === -1) throw new Error("Brak JSON w odpowiedzi");
  return JSON.parse(raw.slice(start, end + 1));
}

/**
 * Odpowiedź ustrukturyzowana: model zwraca JSON, który walidujemy schematem zod.
 * Gdy JSON jest niepoprawny, próbujemy kolejnego dostawcy.
 */
export async function generateJson<T>(
  schema: z.ZodType<T>,
  req: AiRequest,
): Promise<{ data: T; provider: string; model: string }> {
  const system = [
    req.system,
    "Odpowiadaj WYŁĄCZNIE poprawnym JSON-em, bez komentarzy i bez tekstu poza JSON-em.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return withFallback(async (client, p) => {
    const res = await client.chat.completions.create({
      model: p.model,
      messages: toMessages({ ...req, system }),
      temperature: req.temperature ?? 0.1,
      max_tokens: req.maxTokens,
      response_format: { type: "json_object" },
    });
    const text = res.choices[0]?.message?.content ?? "";
    const data = schema.parse(extractJson(text));
    return { data, provider: p.name, model: p.model };
  });
}
