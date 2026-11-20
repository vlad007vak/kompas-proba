#!/usr/bin/env bash
# Jednorazowa konfiguracja nowego repozytorium utworzonego z szablonu.
# Szablony GitHub NIE kopiują etykiet – uruchom to raz po utworzeniu repo:
#   bash scripts/setup-repo.sh            (w folderze projektu, po `gh auth login`)
set -euo pipefail

label() { gh label create "$1" --color "$2" --description "$3" --force >/dev/null && echo "✓ $1"; }

label "zadanie"       "1D76DB" "Zadanie dla jednego programisty"
label "bug"           "D73A4A" "Coś nie działa"
label "review-needed" "FBCA04" "PR wymaga przeglądu lead AI / Vlada przed merge"
label "kontrakt"      "5319E7" "Zmiana wspólnych typów / API"
label "vlad"          "0E8A16" "Właściciel: Vlad (integrator)"
label "maks"          "006B75" "Właściciel: Maks"
label "andrey"        "B60205" "Właściciel: Andrey"
label "tekst"         "C5DEF5" "Teksty po polsku (UI, README, prezentacja)"

echo "Gotowe. Etykiety: gh label list"
