# Outfitter AI

Two independent frontends for **Outfitter AI**, an AI wardrobe assistant that
suggests two outfits a day from your wardrobe, the weather and your schedule.
Each folder is a standalone Next.js app built from one of the original HTML
prototypes, which are kept untouched in each app's `reference/` folder.

| Folder | Design | Port | Run |
|---|---|---|---|
| `web/` | **Linen** — Familjen Grotesk + Newsreader, indigo weather card, flat-lay outfit cards, dashed care-label tag rows | 3000 | `cd web && npm run dev` |
| `Gallery/` | **Gallery** — Manrope + Pixelify Sans, paper sheet inset in a grey mat, one full editorial hero per look, right slide-in panels | 3001 | `cd Gallery && npm run dev` |

Both can run at once; each has its own port baked into its `dev` script.

## Stack

Next.js 16 (App Router, TypeScript, Turbopack) · React 19 · Tailwind CSS v4 ·
shadcn/ui (Radix base) · Motion for React · Zustand with `persist` · Sonner ·
lucide-react · fonts via `next/font/google`.

## Screens

Both apps implement the same product across real routes: Today, Wardrobe,
Schedule and Settings, plus item editing and an add-item flow.

There is no backend. Data is seeded from the prototypes, held in a Zustand store
and persisted to `localStorage` per app (`outfitter-web-v1`,
`outfitter-gallery-v1`). Weather and the AI tagging are mocked, exactly as in the
prototypes.

## Commands

Inside either folder:

```bash
npm run dev      # development server on that app's port
npm run build    # production build
npm run lint     # eslint
npx tsc --noEmit # type check
```
