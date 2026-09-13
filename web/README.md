# Outfitter AI — web

The Outfitter AI app. See the [repository README](../README.md) for what it is,
where its data comes from and how the sky media works.

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # tsc --noEmit && eslint src — run this before committing
npm run build
```

`reference/` holds the original HTML prototype, untouched, as the visual
reference for every screen.

`AGENTS.md` (and `CLAUDE.md`, which includes it) carry the notes for coding
agents — chiefly that this is Next.js 16 and the docs in
`node_modules/next/dist/docs/` are the authority over older habits.
