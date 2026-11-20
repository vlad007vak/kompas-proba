# Nazwa projektu

> Krótkie hasło: jaki problem rozwiązujemy i dla kogo.

Projekt zespołu **Nazwa zespołu** przygotowany podczas **HackNation 2026** (Bydgoszcz, 21–22.11.2026)
w ramach zadania **Nazwa zadania**.

- 🌐 **Demo:** https://… (link do wersji na Vercelu)
- 🎬 **Wideo (do 2 min):** https://…
- 📊 **Prezentacja:** https://…

## Problem
Opis problemu z perspektywy użytkownika (2–3 zdania).

## Rozwiązanie
Co robi aplikacja i dlaczego to pomaga. Najważniejsze funkcje:

1. …
2. …
3. …

## Jak przetestować (dla jury)
1. Otwórz link demo.
2. …
3. …

## Technologie
- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Base UI)
- Modele językowe przez darmowe API zgodne z OpenAI: Groq, Google Gemini; awaryjnie lokalnie Ollama
- Hosting: Vercel

## Uruchomienie lokalne
```bash
npm install
cp .env.example .env.local   # uzupełnij klucze API
npm run dev                  # http://localhost:3000
```

## Wykorzystane zasoby
Zgodnie z zasadami HackNation informujemy o zasobach przygotowanych lub użytych poza czasem hackathonu:

- **Szablon startowy** przygotowany przez zespół przed wydarzeniem: konfiguracja Next.js + Tailwind + shadcn/ui,
  układ strony po polsku, warstwa AI z przełączaniem darmowych dostawców (`src/lib/ai`), komponent czatu.
  Cała logika związana z zadaniem powstała podczas hackathonu.
- **Biblioteki open source:** Next.js, React, Tailwind CSS, shadcn/ui, Base UI, lucide-react, sonner, zod,
  openai (klient API), react-markdown, remark-gfm.
- **Narzędzia AI:** kod powstawał z pomocą asystenta Claude Code.
- **Źródła danych:** … (uzupełnić – np. oficjalne strony urzędów, zbiory danych od partnera)

## Zespół
- Imię Nazwisko – rola
- …
