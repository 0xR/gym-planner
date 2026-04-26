# Agent Instructions

## Project

Gym muscle group tracker PWA. Logs which muscle groups were trained on which day, calculates conflicts/rest periods, recommends what's safe to train today.

## Stack

- Vite + TypeScript + React
- TanStack Router (file-based routing)
- idb (IndexedDB wrapper)
- vite-plugin-pwa
- CSS Modules / plain CSS — no UI library

## Package Manager

Use **npm**: `npm install`, `npm run dev`, `npm test`, `npm run build`, `npm run lint`

## Verification

Run before reporting work complete:

```bash
npm run lint
npm test
npm run build
```

- `npm test` runs vitest once (no watch). Test files: `**/*.test.ts(x)`
- `npm run build` runs `tsc -b && vite build` — catches type errors

## Data Model

- `MuscleGroup`: union in `src/lib/types.ts`
- `DayEntry`: `{ date, muscleGroups }` or `{ date, restDay: true }`
- Storage: IndexedDB via `src/lib/db.ts`, full history kept, UI shows last 7 days

## Conflict Rules

Encoded in `src/lib/conflicts.ts`:

- Big muscles: `back, chest, shoulders, legs` — Small muscles: `biceps, triceps, traps, calves, abs, forearms`
- Rest period for any conflicting pair: 2 days if both are big, otherwise 1 day
- Conflicting pairs: same muscle group, plus chest ↔ shoulders, chest ↔ triceps, back ↔ biceps, shoulders ↔ triceps, shoulders ↔ traps
- Conflicted groups render red but stay tappable

## PWA

- Standalone display mode
- Fully offline (data is local)
- Installable

## Design Principles

1. **One-tap truth** — primary action is one tap. No confirms, no save buttons, no modals.
2. **Stable layout** — buttons never move; state changes are visual only.
3. **Inform, don't block** — flag conflicts, don't disable.
4. **Temporal navigation** — swipe left/right between days. Today is home.
5. **Nothing extra** — muscle group + date only. No reps, weight, notes.

## Aesthetic

- Dark mode only, muted surfaces, single warm/neutral accent
- Red reserved for conflict warnings; avoid green
- One clean sans-serif
- No glassmorphism, gradient text, card-in-card, neon-on-dark

## Conventions

- Latest versions of all dependencies
- Use `find-docs` skill (ctx7) before answering library API questions
- Big touch targets — primary user is on a phone with chalky hands

## Commit Attribution

AI commits MUST include:

```
Co-Authored-By: (the agent model's name and attribution byline)
```

## Sandbox

`git commit` must run with the sandbox disabled. Commits are GPG-signed,
and the gpg-agent / keyboxd Unix sockets aren't reachable from inside the
sandbox — signing fails with "No Keybox daemon running". Run commits with
`dangerouslyDisableSandbox: true`. (Other git operations like `add`,
`status`, `diff`, `log` work fine inside the sandbox.)
