# Outfitter AI

An AI wardrobe assistant that suggests two outfits a day from your wardrobe,
the real weather and your schedule. The app lives in `web/`; the original HTML
prototype it was built from is kept untouched in `web/reference/`.

```bash
cd web && npm install && npm run dev   # http://localhost:3000
```

## Stack

Next.js 16 (App Router, TypeScript, Turbopack) · React 19 · Tailwind CSS v4 ·
shadcn/ui (Radix base) · Motion for React · Zustand with `persist` · Sonner ·
lucide-react · fonts via `next/font/google`.

## Screens

Today, Weather, Wardrobe, Schedule and Settings, plus item editing and an
add-item flow.

## Data

There is no backend and no sign-in yet.

Your wardrobe, schedule and settings are seeded from the prototype, held in a
Zustand store and persisted to `localStorage` under `outfitter-web-v1`. Outfit
picks are computed in [picks.ts](web/src/lib/picks.ts) — every piece is scored
against the temperature, the rain and the dressiest thing on the day, and
anything still resting is skipped.

The weather is real, fetched on the server and cached. All of it is keyless:

| Source | For |
|---|---|
| Open-Meteo | forecast, 15-minute precipitation nowcast, air quality, 30-year normal highs |
| Open-Meteo geocoding | a typed place name |
| Nominatim (OSM) | reverse geocoding, when the browser gives coordinates |

The AI tagging in the add-item flow is still mocked, as in the prototype.

## Sky media

The Today and Weather heroes show the sky you actually have: a still from
`public/sky/`, and over it a short silent clip from `public/sky/video/` — one
per weather scene, day and night.

Each clip is a palindrome, eight seconds forward and the same eight reversed,
so it loops without a cut. They were fetched once from Pixabay (the manifest
with its attribution is [sky-clips.json](web/src/data/sky-clips.json)) and are
committed, so no key is needed to run the app. Stills are Wikimedia Commons;
three of them are CC BY-SA and are credited on screen from
`public/sky/credits.json`.

## Commands

Inside `web/`:

```bash
npm run dev      # development server on :3000
npm run build    # production build
npm run check    # tsc --noEmit && eslint src
npm run lint     # eslint
```
