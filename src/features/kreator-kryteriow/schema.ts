import { z } from "zod";

import { OPIS_MAX, OPIS_MIN } from "./constants";

/** Ciało żądania POST /api/kreator. */
export const kreatorRequestSchema = z.object(
  {
    opisStanowiska: z
      .string({ error: "Podaj opis stanowiska." })
      .trim()
      .min(OPIS_MIN, { error: `Opis stanowiska musi mieć co najmniej ${OPIS_MIN} znaków.` })
      .max(OPIS_MAX, { error: `Opis stanowiska może mieć najwyżej ${OPIS_MAX} znaków.` }),
    arkusz: z.enum(["A", "B", "C"], { error: "Wybierz arkusz A, B albo C." }),
  },
  { error: "Nieprawidłowe zapytanie." },
);

export type KreatorRequest = z.infer<typeof kreatorRequestSchema>;
