import { ArrowRightIcon, ClipboardListIcon, SparklesIcon, UserRoundIcon } from "lucide-react";

import { AiChat } from "@/components/ai/ai-chat";
import { AiStatus } from "@/components/ai/ai-status";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/config/app";

// TODO(zadanie): opisz 3 kroki korzystania z aplikacji.
const STEPS = [
  {
    icon: UserRoundIcon,
    title: "1. Powiedz nam o sobie",
    text: "Krótka anketa – tylko te pytania, które są naprawdę potrzebne.",
  },
  {
    icon: SparklesIcon,
    title: "2. AI analizuje sytuację",
    text: "Asystent dobiera informacje i podpowiada kolejne kroki.",
  },
  {
    icon: ClipboardListIcon,
    title: "3. Otrzymujesz plan",
    text: "Konkretna lista działań z terminami i linkami do źródeł.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
      <section className="flex flex-col items-start gap-4">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {APP_CONFIG.name}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{APP_CONFIG.tagline}</p>
        <div className="flex flex-wrap gap-2">
          <a href="#asystent" className={buttonVariants({ size: "lg" })}>
            Wypróbuj asystenta <ArrowRightIcon data-icon="inline-end" />
          </a>
          <a href="#jak-to-dziala" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Jak to działa
          </a>
        </div>
      </section>

      <section id="jak-to-dziala" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Jak to działa</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="mb-2 size-6 text-primary" aria-hidden />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="asystent" className="grid scroll-mt-20 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Asystent AI</CardTitle>
            <CardDescription>
              Odpowiedzi generuje model językowy – mogą zawierać błędy. Ważne informacje
              sprawdź w oficjalnych źródłach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiChat />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status AI</CardTitle>
            <CardDescription>Dostawcy w kolejności prób (fallback).</CardDescription>
          </CardHeader>
          <CardContent>
            <AiStatus />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
