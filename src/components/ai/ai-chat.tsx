"use client";

import { Loader2Icon, SendIcon, SquareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

// TODO(zadanie): przykładowe pytania dopasowane do zadania.
const SUGGESTIONS = [
  "Wyjaśnij w 3 punktach, co potrafi ta aplikacja.",
  "Jakie dokumenty są zwykle potrzebne w urzędzie?",
  "Podaj przykład prostego planu krok po kroku.",
];

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const history: Message[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Nie udało się uzyskać odpowiedzi.");
      }

      setProvider(`${res.headers.get("X-AI-Provider")} · ${res.headers.get("X-AI-Model")}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
    } catch (err) {
      if (controller.signal.aborted) {
        // Zatrzymano przed pierwszym słowem – usuń pusty dymek odpowiedzi.
        setMessages((prev) => (prev.at(-1)?.content === "" ? prev.slice(0, -1) : prev));
        return;
      }
      toast.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd.");
      setMessages(history.slice(0, -1));
      setInput(content);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex max-h-[28rem] min-h-48 flex-col gap-3 overflow-y-auto rounded-lg border bg-muted/30 p-3"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="m-auto flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
            <p>Zadaj pytanie albo wybierz przykład:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2",
                m.role === "user"
                  ? "self-end bg-primary text-primary-foreground"
                  : "self-start border bg-background",
              )}
            >
              {m.role === "assistant" ? (
                m.content ? (
                  <Markdown>{m.content}</Markdown>
                ) : (
                  <Loader2Icon className="size-4 animate-spin" aria-label="AI pisze odpowiedź" />
                )
              ) : (
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="ai-input" className="sr-only">
          Twoje pytanie
        </label>
        <Textarea
          id="ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Napisz pytanie… (Enter – wyślij, Shift+Enter – nowa linia)"
          className="max-h-40 min-h-11"
          disabled={loading}
        />
        {loading ? (
          <Button type="button" variant="outline" size="icon-lg" onClick={() => abortRef.current?.abort()} aria-label="Zatrzymaj">
            <SquareIcon />
          </Button>
        ) : (
          <Button type="submit" size="icon-lg" disabled={!input.trim()} aria-label="Wyślij">
            <SendIcon />
          </Button>
        )}
      </form>

      {provider && <p className="text-xs text-muted-foreground">Odpowiada: {provider}</p>}
    </div>
  );
}
