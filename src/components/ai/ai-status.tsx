"use client";

import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProviderInfo = { name: string; id: string; model: string };
type ProviderCheck = { name: string; model: string; ok: boolean; latencyMs: number; detail: string };

/** Panel diagnostyczny: którzy dostawcy AI są skonfigurowani i czy odpowiadają. */
export function AiStatus() {
  const [providers, setProviders] = useState<ProviderInfo[] | null>(null);
  const [results, setResults] = useState<ProviderCheck[] | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((d: { providers: ProviderInfo[] }) => {
        if (!cancelled) setProviders(d.providers);
      })
      .catch(() => {
        if (!cancelled) setProviders([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function runCheck() {
    setChecking(true);
    try {
      const r = await fetch("/api/ai/status", { method: "POST" });
      const d: { results: ProviderCheck[] } = await r.json();
      setResults(d.results);
    } finally {
      setChecking(false);
    }
  }

  if (providers === null) {
    return <Loader2Icon className="size-4 animate-spin" aria-label="Ładowanie" />;
  }

  if (providers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Brak skonfigurowanych dostawców. Skopiuj <code>.env.example</code> do{" "}
        <code>.env.local</code> i wpisz klucze.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {providers.map((p, i) => (
          <Badge key={p.name} variant="outline">
            {i + 1}. {p.name} · {p.model}
          </Badge>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-fit" onClick={runCheck} disabled={checking}>
        {checking && <Loader2Icon className="animate-spin" />}
        Testuj połączenie
      </Button>
      {results && (
        <ul className="flex flex-col gap-1 text-sm">
          {results.map((r) => (
            <li key={r.name} className="flex items-start gap-2">
              {r.ok ? (
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-green-600" aria-label="Działa" />
              ) : (
                <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-label="Błąd" />
              )}
              <span>
                <strong>{r.name}</strong> ({r.latencyMs} ms): {r.detail}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
