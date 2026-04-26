# Product

## Register

product

## Users

A solo user — the developer themselves — on a phone, at or near the gym. The use moment is short and physical: pull the phone out, glance at what's safe to train, tap to log, pocket. Hands may be chalky, sweaty, or shaky from the previous set. The screen is being read in fluorescent gym light or outdoor sun, often one-handed, sometimes through gym mirrors out of the corner of an eye. There is no shared use, no team, no admin, no settings page worth opening. The app is a tool, used in seconds, many times a week.

## Product Purpose

A muscle-group recovery tracker. The user logs which muscle groups they trained on a given day; the app calculates rest periods and conflict rules (e.g. chest ↔ triceps, two days for big-muscle pairs) and surfaces what's safe to train today. It is not a workout logger — no exercises, no reps, no weight, no notes, no PRs, no charts. The single job is "what can I hit today without overlapping yesterday's work" and "did I train [X] recently enough that I should give it another day." Success is a tap-and-pocket interaction that is faster than thinking about it.

## Brand Personality

Calm, assured, functional. The voice of a well-made tool, not a coach and not a hype app. Three words: **calm, assured, functional**. There is no cheerleading copy, no streaks, no badges, no notifications nudging behavior. The interface speaks rarely and with confidence: a date, a label, a state. When it warns about a conflict it does so flatly, never in red caps, never with an exclamation. The product trusts the user to make the call.

## Anti-references

- **Generic fitness app aesthetic.** Pure black backgrounds with neon green accents. Treadmill-console UI. Anything that looks like it ships with a heart-rate monitor.
- **Hype-and-streak gamification.** No streak counters, no XP, no celebratory confetti, no "great job!" toasts. The user is an adult with a gym membership; this is not Duolingo.
- **Coach voice.** No motivational microcopy ("Crush leg day!"). No emoji in product UI. No imperative second-person.
- **Neon-on-dark cyber.** No saturated cyan/magenta on near-black, no glow halos, no scanlines.
- **Glassmorphism.** No frosted backdrop blurs as decoration. No translucent cards over busy gradients.
- **Gradient text.** No `background-clip: text`. No two-tone display headlines.
- **Card-in-card nesting.** No card containing another card containing a third pill.
- **Modal-first thinking.** No confirmation dialogs to log a tap. No bottom sheets for state that fits inline.
- **Save buttons.** Toggling a muscle group is the action; there is no "save changes."

## Design Principles

1. **One-tap truth.** The primary action, logging a muscle group, is a single tap. No confirmation, no save button, no modal, no animation longer than the tap. The state has changed; the screen reflects it; that is the entire interaction.
2. **Stable layout.** Buttons live in fixed positions across every state. Disabled, conflicted, selected, and idle states change color, opacity, and weight, never position, never size, never order. The user builds a muscle memory of _where to tap_ that is immune to data changes.
3. **Inform, don't block.** Conflicts are flagged visually (red, icon, dimmed) but remain tappable. The app advises; the user decides. Disabling a control to "protect" the user is condescending and breaks principle #2.
4. **Temporal navigation.** The day is the unit. Swipe left/right to move between days. Today is home. There is no week view, month view, calendar, history page, or stats screen, history is accessed by swiping back, one day at a time.
5. **Nothing extra.** Muscle group + date. Nothing else, ever. Not exercises, not reps, not weight, not RPE, not notes, not photos, not goals, not plans. New features are presumed wrong until proven otherwise; the bar is "would removing this feel like a loss in a chalky-handed gym moment."

## Accessibility & Inclusion

- **Touch targets.** Every primary control is a large pill, in practice the muscle buttons fill a 2-column grid edge-to-edge. The user is interacting with chalky, sweaty, or shaky hands; precision tapping is not a given.
- **Conflict signaling is multi-channel.** Red is reinforced with a warning icon and reduced opacity, never carried by hue alone, so the conflict state survives color-vision differences and direct sunlight on a phone screen.
- **Motion is restrained.** Transitions are state-only (color/opacity, brief 0.15s ease). No scroll-driven choreography, no parallax, no celebratory animation. `prefers-reduced-motion` should be honored anywhere a transform is added.
- **Outdoor / glare resilience.** Dark mode reduces emitted light but high contrast between text and surface is non-negotiable. Body text against surface stays well above WCAG AA at all times; the warm accent against its dark surface is treated as decorative emphasis, not load-bearing copy.
- **No notifications, no account, no network.** The app is local-only. Privacy is a side effect of "nothing extra."
