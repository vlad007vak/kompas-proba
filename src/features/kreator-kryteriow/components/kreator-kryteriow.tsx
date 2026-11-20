"use client";

import { InfoIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  ARKUSZE,
  getKryterium,
  isArkuszTyp,
  kryteriaObowiazkowe,
  MAX_KRYTERIOW_DODATKOWYCH,
  ZRODLO_URL,
} from "@/lib/kryteria";
import type { ArkuszTyp, SugestiaKryterium } from "@/types/ocena";

import { OPIS_MAX, OPIS_MIN, PRZYKLADOWY_OPIS, ZASTRZEZENIE_AI } from "../constants";
import { KartaSugestii } from "./karta-sugestii";
import { ListaObowiazkowych } from "./lista-obowiazkowych";

const TYPY_ARKUSZY: readonly ArkuszTyp[] = ["A", "B", "C"];

type Wynik = { arkusz: ArkuszTyp; sugestie: SugestiaKryterium[] };

export function KreatorKryteriow() {
  const [opis, setOpis] = useState("");
  const [arkusz, setArkusz] = useState<ArkuszTyp | null>(null);
  const [loading, setLoading] = useState(false);
  const [wynik, setWynik] = useState<Wynik | null>(null);

  const dlugosc = opis.trim().length;
  const opisZaKrotki = dlugosc > 0 && dlugosc < OPIS_MIN;
  const moznaWyslac = arkusz !== null && dlugosc >= OPIS_MIN && dlugosc <= OPIS_MAX && !loading;
  // Wynik dla innego arkusza jest nieaktualny (mógł zawierać kryteria obowiązkowe nowego arkusza).
  const aktualnyWynik = wynik && wynik.arkusz === arkusz ? wynik : null;

  async function zaproponuj(e: React.FormEvent) {
    e.preventDefault();
    if (!moznaWyslac || !arkusz) return;

    const zapytanyArkusz = arkusz;
    setLoading(true);
    try {
      const res = await fetch("/api/kreator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opisStanowiska: opis, arkusz: zapytanyArkusz }),
      }).catch(() => {
        throw new Error("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
      });
      const data: { sugestie?: SugestiaKryterium[]; error?: string } | null = await res
        .json()
        .catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? "Nie udało się pobrać propozycji. Spróbuj ponownie.");
      }
      setWynik({ arkusz: zapytanyArkusz, sugestie: data?.sugestie ?? [] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Dane do oceny</CardTitle>
            <CardDescription>
              Wklej obowiązki ze stanowiska pracownika i wybierz typ arkusza.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={zaproponuj} noValidate>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label htmlFor="opis-stanowiska">Opis stanowiska (obowiązki)</Label>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto px-0"
                    onClick={() => setOpis(PRZYKLADOWY_OPIS)}
                  >
                    Wstaw przykładowy opis
                  </Button>
                </div>
                <Textarea
                  id="opis-stanowiska"
                  value={opis}
                  onChange={(e) => setOpis(e.target.value)}
                  maxLength={OPIS_MAX}
                  placeholder="Np. Specjalista w Departamencie Obsługi Klienta. Odpowiada na zapytania obywateli…"
                  className="min-h-40"
                  aria-describedby="opis-licznik"
                  aria-invalid={opisZaKrotki || undefined}
                />
                <p
                  id="opis-licznik"
                  className={
                    opisZaKrotki
                      ? "text-xs text-destructive"
                      : "text-xs text-muted-foreground"
                  }
                >
                  {opis.length} / {OPIS_MAX} znaków
                  {opisZaKrotki && ` – wpisz co najmniej ${OPIS_MIN} znaków`}
                </p>
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend id="arkusz-legenda" className="mb-2 text-sm font-medium">
                  Typ arkusza
                </legend>
                <RadioGroup
                  value={arkusz ?? ""}
                  onValueChange={(v) => {
                    const typ = String(v);
                    if (isArkuszTyp(typ)) setArkusz(typ);
                  }}
                  aria-labelledby="arkusz-legenda"
                  className="grid gap-2 sm:grid-cols-3"
                >
                  {TYPY_ARKUSZY.map((typ) => (
                    <label
                      key={typ}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
                    >
                      <RadioGroupItem value={typ} className="mt-0.5" />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">Arkusz {typ}</span>
                        <span className="text-xs text-muted-foreground">{ARKUSZE[typ].dla}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>

              <div className="flex flex-col gap-3">
                <Button type="submit" size="lg" className="w-full sm:w-fit" disabled={!moznaWyslac} aria-busy={loading}>
                  {loading ? <Loader2Icon className="animate-spin" aria-hidden /> : <SparklesIcon aria-hidden />}
                  {loading ? "AI analizuje opis…" : "Zaproponuj kryteria"}
                </Button>
                {!arkusz && (
                  <p className="text-xs text-muted-foreground">
                    Wybierz arkusz i wpisz opis, aby otrzymać propozycje.
                  </p>
                )}
              </div>

              <Alert>
                <InfoIcon aria-hidden />
                <AlertDescription>
                  {ZASTRZEZENIE_AI} AI proponuje najwyżej {MAX_KRYTERIOW_DODATKOWYCH} kryteria
                  dodatkowe z oficjalnego katalogu (
                  <a href={ZRODLO_URL} target="_blank" rel="noreferrer">
                    Dz.U. 2016 poz. 470
                  </a>
                  , § 5 ust. 2).
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kryteria obowiązkowe</CardTitle>
            <CardDescription>
              {arkusz
                ? `Arkusz ${arkusz} – ${ARKUSZE[arkusz].dla} (§ 4).`
                : "Wybierz typ arkusza, aby zobaczyć kryteria obowiązkowe."}
            </CardDescription>
          </CardHeader>
          {arkusz && (
            <CardContent>
              <ListaObowiazkowych kryteria={kryteriaObowiazkowe(arkusz)} />
            </CardContent>
          )}
        </Card>
      </div>

      <section aria-labelledby="sugestie-naglowek" aria-live="polite" className="flex flex-col gap-4">
        {aktualnyWynik && (
          <>
            <h2 id="sugestie-naglowek" className="text-xl font-semibold">
              Propozycje kryteriów dodatkowych
            </h2>
            {aktualnyWynik.sugestie.length === 0 ? (
              <Alert>
                <InfoIcon aria-hidden />
                <AlertDescription>
                  AI nie znalazło kryteriów dodatkowych pasujących do tego opisu. Doprecyzuj
                  obowiązki na stanowisku albo wybierz kryteria samodzielnie z katalogu.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {aktualnyWynik.sugestie.map((s) => {
                  const kryterium = getKryterium(s.kryteriumId);
                  return kryterium ? (
                    <KartaSugestii key={s.kryteriumId} kryterium={kryterium} uzasadnienie={s.uzasadnienie} />
                  ) : null;
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
