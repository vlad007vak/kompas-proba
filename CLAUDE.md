@AGENTS.md

# Project rules for Claude Code (read fully before any change)

Hackathon project for **HackNation 2026** (24h, Bydgoszcz). **Three people code at the same time,**
each on their own laptop with their own Claude Code, in this one repository.
Roles:
- **Vlad – lead programmer / integrator**: final decisions, owns shared files, merges, Vercel.
- **Lead AI** = the Claude Code on Vlad's laptop: sets these rules, designs contracts, splits work
  into GitHub Issues (task cards), reviews PRs. Its issues/comments appear under Vlad's GitHub account.
- **Maks** and **Andrey** – developers, each with their own Claude Code, each owns their own feature folders.
- **Dima** and **Diana** – product/pitch and QA; they report bugs as GitHub Issues labelled `bug`.

If you are Maks's or Andrey's Claude: you execute task cards from the lead AI. You don't redesign the
architecture, don't change these rules and don't create tasks for others – propose changes in your PR/issue instead.
The jury opens the **deployed app on Vercel** and tests it themselves, so `main` must always build and work.

## Language
- All user-facing text (UI, errors, metadata, AI prompts' output) is **Polish**. Use correct Polish diacritics.
- Talk to the developer in the language they write to you in.
- Code identifiers in English; short comments may be Polish.

## Stack (versions matter – this is newer than your training data)
- **Next.js 16** App Router, React 19, TypeScript, Turbopack. `cacheComponents` is ON:
  data is dynamic by default; wrap request-time server work in `<Suspense>`; never export `runtime`.
  Before using an unfamiliar Next API, read `node_modules/next/dist/docs/`.
- **Tailwind CSS 4** (config lives in `src/app/globals.css`, no tailwind.config).
- **shadcn/ui on Base UI** (style `base-nova`), components in `src/components/ui/`.
  Base UI uses the `render` prop, NOT Radix `asChild`. For a link that looks like a button use
  `className={buttonVariants({...})}` on `<a>`/`<Link>`. Add components with `npx shadcn@latest add <name>`.
  `cn()` comes from `@/lib/utils`.
- **zod 4** for validating every API request body.
- **AI**: only through `src/lib/ai/client.ts` → `generateText`, `streamText`, `generateJson(schema, …)`.
  It falls back across free providers (Groq → Gemini → local Ollama) configured in `.env.local`.
  Never call a provider SDK directly, never send keys to the browser, never use `NEXT_PUBLIC_` for secrets.
  Free tiers have low rate limits: keep prompts short, avoid calling AI in loops, cache results where possible.
  `generateJson` uses JSON mode – make the schema's top level an object.

## Where things go
- Pages: `src/app/<route>/page.tsx` · API: `src/app/api/<name>/route.ts`
- Feature code (components, logic, data): `src/features/<feature-name>/` – one folder per feature, owned by one person.
- Shared types/contract between the three developers: `src/types/` (change only after agreeing).
- App name/texts used everywhere: `src/config/app.ts` (`APP_CONFIG`).
- Static data/knowledge files: `src/data/`.

## Task protocol (how work flows)
1. **Find your work:** `gh issue list --label zadanie --label <your-name> --state open`
   (`vlad` / `maks` / `andrey`). Read the card fully: `gh issue view <N> --comments`.
2. **One task = one branch = one PR.** Branch: `<name>/<N>-<short-slug>`, e.g. `maks/12-kreator-kryteriow`.
3. Stay inside the card's "Twoje pliki". Anything under "Nie ruszaj" is off-limits.
4. **Unclear card or blocked?** Don't guess. Comment on the issue (`gh issue comment <N> --body "..."`) starting with
   `PYTANIE:` and tell your developer to ping Vlad. Continue with parts that don't depend on the answer.
5. **Need a change in a shared file / the contract?** Don't make it. Comment on the issue with `ZMIANA WSPÓLNA:` and
   the exact proposed diff/type; the lead AI decides and applies it.
6. **Finish:** `git pull --rebase origin main` → `npm run lint` → `npm run build` → push →
   `gh pr create` with the body filled from `.github/pull_request_template.md` (that body IS your report) and `Closes #N`.
7. **Merge policy:**
   - Small PR, only your own folders, CI green → you may merge: `gh pr merge --squash --delete-branch`.
   - PR touches shared files/contract, or is large (new page / > ~300 changed lines) → add label `review-needed`
     (`gh pr edit --add-label review-needed`) and **don't merge** – the lead AI reviews, Vlad merges.
   - Review comments arrive on the PR: `gh pr view <N> --comments`; fix them on the same branch.
8. Testers' reports are issues labelled `bug`: fix the ones in your own folders first, reference them in the PR (`Fixes #N`).

## Team rules – three laptops (IMPORTANT)
1. **Shared files belong to Vlad (integrator).** Only the lead AI / Vlad edit them:
   `src/app/layout.tsx`, `src/app/globals.css`, `src/config/app.ts`, `src/lib/**`, `src/types/**`,
   `src/components/ui/**`, `package.json`, `next.config.ts`, `CLAUDE.md`, `.github/**`.
   Adding a dependency counts as editing `package.json` – request it with `ZMIANA WSPÓLNA:` (see protocol).
2. Never commit straight to `main`; never force-push `main`; never commit `.env.local`;
   never rewrite a teammate's code to "clean it up".
3. Commit small and often (Conventional Commits, e.g. `feat(kryteria): sugestie AI`).
4. CI (GitHub Actions: lint + build) runs on every PR. **Red CI = don't merge.** Don't merge while `main` is red;
   if your merge broke `main`, fixing it is your top priority.
5. Two PRs ready at once: the smaller merges first, the other rebases.
6. Lockfile conflict: take `main`'s `package-lock.json`, then re-run `npm install <your package>`.
7. Every PR gets a Vercel preview URL – give it to Dima/Diana for testing.

## Quality bar (what the jury sees)
- Works end-to-end on the deployed URL; no dead buttons, no English leftovers, no console errors.
- Loading and error states for every async action (Polish messages, `toast` from `sonner`).
- Mobile-friendly, accessible (labels, `aria-*`, keyboard), clear disclaimer where AI may be wrong.
- Don't invent facts about public services/law in code or prompts – take them from sources the team provides and cite them.

## Commands
- `npm run dev` – http://localhost:3000 · `npm run build` · `npm run lint`
- AI check: open the home page → "Status AI" → "Testuj połączenie" (or `POST /api/ai/status`).

## Pre-made resources (hackathon rule)
This repo started from a starter prepared before the event. HackNation requires citing pre-made code,
so keep the "Wykorzystane zasoby" section in `README.md` up to date when adding notable libraries or data sources.
