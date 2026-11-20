/**
 * Kontrakt domeny „ocena okresowa w służbie cywilnej” – wspólny dla całego zespołu.
 * Źródło: rozporządzenie PRM z 4.04.2016 (Dz.U. 2016 poz. 470) i ustawa o służbie cywilnej.
 * Zmiany tylko przez lead AI / Vlada (patrz CLAUDE.md).
 */

/** A – kierownik urzędu, B – stanowisko kierownicze, C – pozostałe stanowiska (§ 3). */
export type ArkuszTyp = "A" | "B" | "C";

/** Ocena cząstkowa za jedno kryterium (§ 11 ust. 1 pkt 1). */
export type OcenaCzastkowa = 1 | 3 | 5 | 7 | 9;

/** Poziom spełniania kryteriów (§ 11 ust. 1 pkt 1–2). */
export type PoziomOceny =
  | "znacznie poniżej oczekiwań"
  | "poniżej oczekiwań"
  | "na poziomie oczekiwań"
  | "powyżej oczekiwań"
  | "znacznie powyżej oczekiwań";

/** Kryterium z załącznika nr 1 wraz ze wskaźnikami behawioralnymi. */
export interface Kryterium {
  /** Stały identyfikator, np. "wspolpraca". */
  id: string;
  nr: number;
  nazwa: string;
  wskazniki: string[];
}

export interface Arkusz {
  typ: ArkuszTyp;
  /** Dla jakich stanowisk jest arkusz. */
  dla: string;
  /** Id kryteriów obowiązkowych (§ 4). */
  obowiazkowe: string[];
}

/** Propozycja kryterium dodatkowego (np. z AI). */
export interface SugestiaKryterium {
  kryteriumId: string;
  uzasadnienie: string;
}

/** Wynik wyliczenia oceny według § 11. */
export interface WynikOceny {
  /** Średnia arytmetyczna ocen cząstkowych. */
  srednia: number;
  poziom: PoziomOceny;
  wynik: "pozytywna" | "negatywna";
  /** Uzasadnienie obowiązkowe przy ocenie negatywnej (§ 11 ust. 3). */
  wymagaUzasadnienia: boolean;
}
