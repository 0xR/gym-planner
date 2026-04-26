---
name: Gym Planner
description: A muscle-group recovery tracker for one chalky-handed user, glanced at between sets.
colors:
  bg: "oklch(0.13 0.005 250)"
  surface: "oklch(0.25 0.015 250)"
  surface-hover: "oklch(0.31 0.015 250)"
  border: "oklch(0.35 0.02 250)"
  text: "oklch(0.93 0.01 250)"
  text-secondary: "oklch(0.8 0.01 250)"
  text-tertiary: "oklch(0.56 0.01 250)"
  accent-sand-amber: "oklch(0.72 0.12 70)"
  accent-text: "oklch(0.15 0.02 70)"
  accent-text-dim: "oklch(0.3 0.04 70)"
  age-recent: "oklch(0.5 0.008 250)"
  age-moderate: "oklch(0.57 0.05 75)"
  age-due: "oklch(0.65 0.11 65)"
  age-overdue: "oklch(0.62 0.16 30)"
  warn: "oklch(0.52 0.14 25)"
  warn-text: "oklch(0.95 0.03 25)"
  warn-text-dim: "oklch(0.75 0.06 25)"
  warn-border: "oklch(0.44 0.12 25)"
  warn-muted: "oklch(0.62 0.12 25)"
typography:
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.02em"
  meta:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
rounded:
  sm: "8px"
  md: "12px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
components:
  muscle-btn:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0.5rem"
  muscle-btn-selected:
    backgroundColor: "{colors.accent-sand-amber}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.md}"
    padding: "0.5rem"
  muscle-btn-selected-warn:
    backgroundColor: "{colors.warn}"
    textColor: "{colors.warn-text}"
    rounded: "{rounded.md}"
    padding: "0.5rem"
  muscle-btn-conflicted:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.warn-muted}"
    rounded: "{rounded.md}"
    padding: "0.5rem"
  rest-day-btn:
    backgroundColor: "transparent"
    textColor: "{colors.text-tertiary}"
    rounded: "{rounded.md}"
    padding: "0.75rem"
  rest-day-btn-selected:
    backgroundColor: "{colors.accent-sand-amber}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.md}"
    padding: "0.75rem"
  nav-arrow:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 0.75rem"
---

# Design System: Gym Planner

## 1. Overview

**Creative North Star: "The Pocket Tool"**

Gym Planner reads like a well-made hand tool: a single, fixed face of clearly-labelled controls, its state visible in a glance, indifferent to mood. The surface is a cool slate dark — not black — and the only warmth in the system is a sand-amber accent that marks "this is what you just did." Conflict is a muted iron-oxide red, never an alarm. Age is a slow gradient from cool grey at "fresh" to embered rust at "overdue", letting the user feel time without reading numbers.

The system rejects everything that calls attention to itself: no glassmorphism, no gradient text, no streaks, no toasts, no celebratory motion, no green. It also rejects the opposite trap — the all-grey "neutral" SaaS dashboard. Warmth and rust live in the palette deliberately, because the product's signal _is_ time-since-trained, and time-since-trained is a temperature, not a number.

Density is medium-low. The 2-column muscle grid fills the viewport edge-to-edge with chunky, fixed-position buttons sized for chalky hands. Spacing is tight (0.25–1rem) but never crowded. Typography is one system sans, hierarchy by weight (400/500/600) and size (0.7–1.25rem). Movement is state-only: a 0.15s color/opacity fade on toggle, a 0.1s active scale on tap, and a translate during the day-to-day swipe. Nothing else moves.

**Key Characteristics:**

- Dark, cool slate surface — never `#000`, never warm-grey beige.
- One warm accent (sand-amber). Used on ≤1 muscle button per row in the common case.
- Conflict and age share a warm hue family (rust → amber → red-orange) so the user reads "warmth = attention."
- Flat. No shadows, no elevation tokens, no card-in-card. Depth is conveyed by surface-vs-bg lightness alone.
- Stable layout: state changes are color, weight, opacity. Never position, size, or order at runtime.
- One typeface: the system stack. Numerals are tabular where they appear.

## 2. Colors: The Slate-and-Sand Palette

A two-temperature palette: cool slate carries every neutral surface and text role; warm sand-amber carries every "active / important / aged" role. There is no third hue family — green is excluded by doctrine, blue is excluded for the same reason.

### Primary

- **Sand Amber** (`oklch(0.72 0.12 70)`): the single warm accent. Used as the fill of a muscle button when it is selected, and as the fill of the Rest Day pill when active. Also the color of the today-target dot in the header. Appears on **at most ~10% of any given screen** by surface area — its rarity is the point.

### Secondary

- **Iron Oxide** (`oklch(0.52 0.14 25)`): the conflict fill. Used when a muscle group is selected _and_ in conflict with recent training. Never used decoratively, never as a generic warning shade — it is reserved for "you just selected something that conflicts."
- **Iron Oxide Border** (`oklch(0.44 0.12 25)`): the conflict outline. Used on conflicted-but-not-selected muscle buttons, paired with reduced opacity.
- **Iron Oxide Muted** (`oklch(0.62 0.12 25)`): the conflict text and warning-icon stroke on conflicted-but-not-selected buttons.

### Tertiary — The Age Gradient

A four-step warm gradient that tints the "Nd ago" badge on each muscle button. The cool→warm progression IS the urgency signal.

- **Quiet Slate** (`oklch(0.5 0.008 250)`, ≤2 days): just trained, no urgency.
- **Faded Sand** (`oklch(0.57 0.05 75)`, 3–4 days): coming due, gentle warmth.
- **Aged Amber** (`oklch(0.65 0.11 65)`, 5–6 days): due, full warmth.
- **Embered Rust** (`oklch(0.62 0.16 30)`, ≥7 days): overdue, the warmest tone in the system.

### Neutral

- **Slate Ink** (`oklch(0.13 0.005 250)`): the page background. Cool, near-black but not pure black. The single coolest tone in the system.
- **Tool Steel** (`oklch(0.25 0.015 250)`): every default surface — muscle button fill, raised panel.
- **Tool Steel Lifted** (`oklch(0.31 0.015 250)`): the active/pressed state for ghost buttons (nav arrow, today-btn).
- **Cold Border** (`oklch(0.35 0.02 250)`): the 2px outline on muscle buttons and the dashed outline on Rest Day.
- **Chalk White** (`oklch(0.93 0.01 250)`): primary text — the muscle name when selected; the day name in the header.
- **Chalk Dim** (`oklch(0.8 0.01 250)`): secondary text — the muscle name when not selected; nav arrows.
- **Quiet Steel** (`oklch(0.56 0.01 250)`): tertiary text — the date subtitle, the Rest Day label.

### Named Rules

**The One-Voice Rule.** Sand Amber is the only fully-saturated color in the resting state of the app. If two muscle groups are selected, two Sand Amber buttons appear; that is the maximum saturation the screen ever carries. Iron Oxide only appears as a _consequence_ of selection (you selected a conflict). Never decorative.

**The Temperature-as-Time Rule.** Warmth in the palette always means "older / due / urgent." Cool means "recent / fresh." Do not introduce a cool warning color or a warm "fresh" color — the user reads the gradient as a thermometer.

**The No-Green Rule.** Green is forbidden in this app. It is the single most common fitness-app cliché and the surest tell of "generic black + neon green tracker." Success states are not signaled by hue; they are signaled by the warm accent fill of the action that just succeeded.

## 3. Typography

**Display Font:** none — the app has no display copy.
**Body / UI Font:** the platform system stack — `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`.
**Label / Meta Font:** same family. Tabular-nums variant for the date subtitle.

**Character:** invisible. The typeface is whatever the user's OS gives them — SF on Apple, Segoe on Windows, system-ui everywhere else. No web font is loaded. No display face exists. The typography's job is to read fast and get out of the way; choosing a "voice font" would betray the brand.

### Hierarchy

- **Title** (600 weight, 1.25rem, line-height 1.2, letter-spacing -0.01em): the day name in the header ("Today", "Mon Apr 22"). The largest and only bold-weight glyph on the screen.
- **Body** (500 weight, 1.1rem): the muscle name on each button. Carries the entire grid.
- **Body — Rest Day** (500 weight, 1rem): the Rest Day pill label.
- **Meta** (400 weight, 0.8rem, tabular-nums): the date subtitle under the day name when off-today.
- **Label** (500 weight, 0.7rem, letter-spacing 0.02em): the "Nd ago" badge inside each muscle button. The smallest type in the system; reads as a tag, not as prose.

### Named Rules

**The One-Family Rule.** No second typeface. No serif accent, no monospace block, no display face. The system stack carries every role; differentiation comes from weight (400/500/600) and size (0.7→1.25rem) only.

**The No-Prose Rule.** This app has no paragraph copy, no marketing line, no help text, no microcopy beyond labels. If a future feature wants paragraph type, the answer is to remove the feature, not add a body style.

## 4. Elevation

The system is **flat by doctrine**. There are no shadows, no `box-shadow` tokens, no elevation scale. Depth is conveyed through surface-vs-background lightness contrast alone: the page background is `Slate Ink` (lightness 0.13); muscle buttons sit on `Tool Steel` (lightness 0.25); pressed states lift to `Tool Steel Lifted` (lightness 0.31). The 0.12-step jump is enough to read as "raised" without needing a shadow.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. The only visual feedback for press is a 0.97 transform scale (muscle buttons) or a 0.98 transform scale (rest day) lasting 0.1s — never a shadow expansion, never a glow, never a halo.

**The No-Glassmorphism Rule.** No `backdrop-filter: blur(...)`. No translucent panels over busy backgrounds. Surfaces are opaque. The dimmed-surface effect on a rest day's grid (opacity 0.6) is the only translucency in the system, and it is applied to ink, not to glass.

## 5. Components

### Buttons — Muscle Toggle (the primary control)

- **Shape:** 12px corner radius, 2px solid border. The buttons fill a 2-column grid edge-to-edge, with a 0.75rem gap, sized to be the largest tappable target the viewport allows.
- **Default:** `Tool Steel` background, `Cold Border` outline, `Chalk Dim` label (500 weight, 1.1rem). An age badge in `Label` style sits below the name, tinted by the age gradient.
- **Selected:** `Sand Amber` fill, `Sand Amber` border (the outline disappears into the fill), `Accent Text` label upgraded to 600 weight. The badge text shifts to `Accent Text Dim`.
- **Selected + Conflicted:** `Iron Oxide` fill, `Iron Oxide` border, `Warm Bone` label at 600 weight. This combination is the loudest state in the system; it fires only when the user actively selects something that conflicts.
- **Conflicted (not selected):** `Tool Steel` fill (unchanged), `Iron Oxide Border` outline, `Iron Oxide Muted` label, opacity 0.65. The conflict warning icon (inline SVG triangle) renders inside the badge in the same hue.
- **Pressed:** `transform: scale(0.97)` for 0.1s. No color change beyond the resting state of the new toggle value.
- **Hover:** none on the production target (touch-only). Color/border/transform transitions all share `0.15s` ease.

### Buttons — Rest Day

- **Shape:** 12px corner radius, **2px dashed** border (the only dashed outline in the system). Sits below the muscle grid, full-width.
- **Default:** transparent fill, `Cold Border` dashed outline, `Quiet Steel` label (500 weight, 1rem).
- **Selected:** `Sand Amber` fill, _solid_ border (`Sand Amber`), `Accent Text` label at 600 weight. The dashed outline becoming solid is itself a state cue.
- **Pressed:** `transform: scale(0.98)` for 0.1s.

### Buttons — Ghost Icon (nav arrows, today-target)

- **Shape:** 8px corner radius, no border, transparent fill.
- **Default:** `Chalk Dim` glyph at 2rem (nav arrows: chevron) or 18px (today-target: dot-in-circle SVG). Today-target tint is `Sand Amber` to mark its function.
- **Pressed:** background lifts to `Tool Steel Lifted` for the duration of the press.
- **Disabled (nav arrow at the day-range edge):** opacity 0.3, pointer-events none.

### Cards / Containers

There are no cards in the system. The grid container, the day header, and the page itself are bare regions of the bg surface. The **No Card-In-Card Rule** below covers the deliberate absence.

### Inputs / Fields

There are no inputs in the system. The product has no text entry, no form, no settings panel. Selection is the only input affordance.

### Navigation

The header is a 3-cell flex row: previous-day arrow, day-label group (day name + optional today-target dot + optional date subtitle), next-day arrow. Day-to-day movement is primarily by horizontal swipe on the grid container; the arrows are a secondary affordance for users who can't or won't swipe. The "today" affordance is a single round-dot icon that appears next to the day name only when the user is not on today.

### Signature Component — The Age Badge

Each muscle button carries a small "Nd ago" label tinted by the age gradient (Quiet Slate → Faded Sand → Aged Amber → Embered Rust). The same slot, when the muscle group is in conflict with recent training, is replaced by a warning-icon + ago-or-source-label pair in iron-oxide hues. The badge is the system's single most information-dense glyph and its only piece of color-coded data.

## 6. Do's and Don'ts

### Do:

- **Do** keep the muscle-button grid in fixed positions. State changes color, weight, opacity — never position, size, or order at runtime.
- **Do** use `Sand Amber` (`oklch(0.72 0.12 70)`) and only Sand Amber as the "selected" fill. Never substitute another hue; never tint it darker for variety.
- **Do** signal conflict through three reinforcing channels: hue (iron-oxide), opacity (0.65 on the un-selected conflicted state), and the inline warning-triangle icon. Never hue alone.
- **Do** use the OKLCH values in `global.css` as the source of truth. The frontmatter in this file mirrors them; if you tweak a shade, tweak it there and re-extract.
- **Do** keep transitions to color/opacity/transform at 0.15s (state) or 0.1s (press). Use `cubic-bezier(0.22, 1, 0.36, 1)` for the day-swipe translate.
- **Do** use tabular-nums for the date subtitle and the "Nd ago" badge. Number alignment is the point.
- **Do** preserve the dashed border on the Rest Day pill in its un-selected state. The dashed→solid transition on selection is a deliberate state cue.

### Don't:

- **Don't** introduce green anywhere. Not for "success," not for a "training streak," not for a chart line. The No-Green Rule is absolute — green is the cliché this product is defined against.
- **Don't** use `#000` for the background. The bg is `oklch(0.13 0.005 250)`, slightly cool, never pure black.
- **Don't** add gradient text (`background-clip: text`) to the day name, the accent number, or anything else. Solid color or no.
- **Don't** add glassmorphism. No `backdrop-filter: blur(...)`, no translucent cards over busy backgrounds.
- **Don't** nest cards. There are no cards to begin with; do not introduce a card to wrap the grid, then a card to wrap each button, then a chip inside the button.
- **Don't** use a side-stripe border (left or right border > 1px in a colored hue). Conflicts are full-border, fills, or icon-tinted, never a stripe down the side.
- **Don't** add a streak counter, XP, badge, or "great job!" toast. The product is not a coach.
- **Don't** add a confirmation dialog or save button to the toggle action. The toggle IS the save.
- **Don't** introduce a second typeface. The system stack carries every role.
- **Don't** add a shadow, glow, or halo on press. The 0.97 transform scale is the entire press feedback.
- **Don't** disable a muscle button to "protect" the user from a conflict. Conflicts are advisory; the button stays tappable. Disabling breaks the Stable Layout principle.
- **Don't** add motion that is not state-coupled. No idle pulses, no shimmer, no scroll-driven choreography. The day-swipe translate is the only non-state animation in the system.
