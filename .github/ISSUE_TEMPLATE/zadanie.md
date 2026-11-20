---
name: Zadanie (task card)
about: Zadanie dla jednego programisty – tworzy je lead AI / Vlad
title: "[Zadanie] "
labels: zadanie
---

## Cel
<!-- 1–2 zdania: co ma działać po zakończeniu (z perspektywy użytkownika). -->

## Właściciel
<!-- vlad / maks / andrey (etykieta o tej samej nazwie) -->

## Kontekst – przeczytaj najpierw
- `CLAUDE.md`
- <!-- pliki/typy/endpointy potrzebne do zadania -->

## Twoje pliki (wolno edytować)
- `src/features/<feature>/**`
- <!-- strony, API -->

## Nie ruszaj (pliki wspólne / cudze)
- `src/types/**`, `src/lib/**`, `src/app/layout.tsx`, `src/app/globals.css`, `package.json`, `src/components/ui/**`
- <!-- foldery innych osób -->

## Kontrakt
<!-- Typy z src/types i API (request → response), na których się opierasz lub które udostępniasz. -->

## Kryteria akceptacji
- [ ] <!-- konkretny, sprawdzalny warunek -->
- [ ] Teksty w UI po polsku, stany ładowania i błędów
- [ ] `npm run lint` i `npm run build` przechodzą

## Gałąź
`<imię>/<numer-zadania>-<krótki-opis>`, np. `maks/12-kreator-kryteriow`

## Po skończeniu
PR z opisem według szablonu (raport) i `Closes #<numer>`.
Jeśli zmieniasz pliki wspólne/kontrakt albo zadanie jest duże → etykieta `review-needed` i NIE merguj sam.
