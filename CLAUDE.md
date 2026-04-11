## Project

Gym muscle group tracker PWA. Logs which muscle groups were trained on which day, calculates conflicts/rest periods, and recommends what's safe to train today.

### Stack
- Vite + TypeScript + React
- TanStack Router (file-based routing)
- idb (IndexedDB wrapper)
- vite-plugin-pwa (service worker + manifest)
- CSS Modules or plain CSS (no UI library)

### Data Model
- `MuscleGroup` is a string union type: `"chest" | "back" | "shoulders" | "biceps" | "triceps" | "legs" | "calves" | "abs"`
- Storage: `{ date: string, muscleGroups: MuscleGroup[] }` per day in IndexedDB
- Keep all history in IndexedDB, UI shows last 7 days for editing

### Conflict Rules
- Same muscle group: 2 day rest
- Strong conflict (chest <-> shoulders): 2 day rest
- Weak conflicts (chest <-> triceps, back <-> biceps, shoulders <-> triceps): 1 day rest
- Conflicted groups shown in red but still tappable (inform, don't block)

### PWA
- Fullscreen display mode
- Offline-capable (all data is local)
- Installable via home screen

### Instructions
- Use latest versions of all dependencies
- Use find-docs skill to look up latest docs for libraries when needed

---

## Design Context

### Users
Solo user (the developer), on a phone, at or near the gym. Context is quick — open the app, see what's safe to train, tap to log, done. Hands may be chalky or sweaty. Big touch targets are critical.

### Brand Personality
Clean, confident, utilitarian. Not flashy, not playful. Like a well-made tool that gets out of the way. Three words: **calm, assured, functional**.

### Aesthetic Direction
- **Theme:** Dark mode only
- **Tone:** Refined minimalism with confidence. No decorative elements. Every pixel earns its place.
- **Layout:** Single-screen swipeable day view. 2-column grid of large toggle buttons for muscle groups. Buttons stay in fixed positions — visual state changes only (color/opacity), never layout shifts.
- **Color approach:** Muted dark surfaces. A single warm or neutral accent for "selected/active" state. Red/warm tones reserved for conflict warnings. Green is too "fitness app cliché" — avoid.
- **Anti-references:** No neon-on-dark cyber aesthetic. No glassmorphism. No gradient text. No card-in-card nesting. No generic fitness app look (black + neon green).
- **Typography:** One clean sans-serif. No display fonts needed — the UI is buttons, not prose.

### Design Principles
1. **One-tap truth** — The most common action (logging a muscle group) is a single tap. No confirmation dialogs, no save buttons, no modals.
2. **Stable layout** — Buttons never move. Disabled/conflicted groups stay in place but change visual state. The user builds muscle memory for button positions.
3. **Inform, don't block** — Conflicted muscle groups are visually flagged (red/dimmed) but still tappable. The app advises, the user decides.
4. **Temporal navigation** — Swipe left/right to move between days. Today is home. History is just "today minus N."
5. **Nothing extra** — No features beyond muscle group + date logging. No exercise names, no reps, no weight, no notes. Ever.
