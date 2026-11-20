import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/** react-markdown przekazuje `node` – nie może trafić do elementu DOM. */
function strip<T extends { node?: unknown }>(props: T): Omit<T, "node"> {
  const { node, ...rest } = props;
  void node;
  return rest;
}

/** Renderuje odpowiedzi AI (markdown) z czytelnym formatowaniem. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("space-y-2 text-sm leading-relaxed break-words", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (p) => (
            <a {...strip(p)} target="_blank" rel="noreferrer" className="underline underline-offset-2" />
          ),
          ul: (p) => <ul {...strip(p)} className="list-disc space-y-1 pl-5" />,
          ol: (p) => <ol {...strip(p)} className="list-decimal space-y-1 pl-5" />,
          h1: (p) => <h3 {...strip(p)} className="text-base font-semibold" />,
          h2: (p) => <h3 {...strip(p)} className="text-base font-semibold" />,
          h3: (p) => <h4 {...strip(p)} className="font-semibold" />,
          code: (p) => <code {...strip(p)} className="rounded bg-muted px-1 py-0.5 font-mono text-xs" />,
          table: (p) => (
            <div className="overflow-x-auto">
              <table {...strip(p)} className="w-full border-collapse text-left text-xs" />
            </div>
          ),
          th: (p) => <th {...strip(p)} className="border-b px-2 py-1 font-medium" />,
          td: (p) => <td {...strip(p)} className="border-b px-2 py-1" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
