# Orbit AI plan

## Product
A calm AI workspace for turning rough thoughts into useful outputs. The MVP includes a focused composer, four task modes, prompt starters, activity history, local persistence, a server-side AI provider adapter, and demo mode when credentials are absent.

## Design
- **Movement:** editorial dark mode with a restrained neo-brutalist utility layer.
- **Principles:** quiet focus, clear hierarchy, expressive lime accent, and tactile controls.
- **Color:** near-black blue-gray surfaces reduce glare; lime signals momentum and action; muted lavender and sky accents distinguish prompt types.
- **Layout:** asymmetric workspace with a permanent utility rail and centered writing stage.
- **Signatures:** orbit mark, lime hairline eyebrows, and italic serif emphasis on the central question.
- **Interaction:** every action gives a visible state; starter cards prefill rather than hide intent; demo mode is explicit.
- **Animation:** small lift on cards, spinner only during network work, no distracting ambient motion.
- **Typography:** Manrope for UI and Georgia italic for emotional emphasis; DM Mono for labels and system metadata.
- **Brand:** Orbit helps thoughtful people move from fuzzy to finished. Personality: grounded, sharp, encouraging.
- **Voice:** “Bring the rough idea. Leave with something sharper.” / “A little momentum goes a long way.”

## Structure
- `src/App.jsx`: workspace state, navigation, composer, starter library, activity feed.
- `src/styles.css`: responsive design system and component styling.
- `server/index.js`: provider-agnostic Node HTTP API, validation, demo fallback.
- `server/index.test.js`: health, validation, and fallback coverage.
