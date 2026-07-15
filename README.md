# Gym Kartel — app

Multi-tier gym membership app for India (UPI). React Native + Expo (dev-client capable), TypeScript strict. Built to the "Soft-Dark Luxury" design system.

## Stack
- **Expo SDK 52** / React Native 0.76 / React 18, TypeScript strict (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- **GraphQL**: [urql](https://formidable.com/open-source/urql/) with `@urql/exchange-graphcache` — the normalized cache is the single source of truth for ALL server state.
- **Client state**: Zustand (UI flags, in-progress onboarding form, offline outbox mirror). React Context only for static values (theme tokens, auth session).
- **Offline**: local-first `expo-sqlite` outbox for check-ins — queued when offline, synced when online, **never blocking the check-in UI on the network**.
- **Navigation**: React Navigation native-stack + bottom-tabs. Exactly 5 member tabs: Home / Gyms / **Check-in (raised center)** / Track / Club. Role switch to an 8-screen coach experience.
- **Icons**: `phosphor-react-native` (fill weight = the one orange active tab). **Motion**: Reanimated 3 (seal-stamp + rank-up only). **Camera/QR**: `react-native-vision-camera`. **Auth**: `expo-secure-store`. Haptics: `expo-haptics`.
- **Codegen**: GraphQL Code Generator points at `@gymkartel/contracts`'s `schema.graphql` and emits typed urql hooks.

## The contract
Pricing, tiers and domain shapes come from `@gymkartel/contracts` (a `file:` link to the backend package). **No price is ever hardcoded** — screens import `PASS_LADDER`, `passPrice`, `passPerDayPrice`, `topUpCost`, `TIER_DAY_RATE`, `COACH_TAKE_RATE` and only DISPLAY them.

## Getting started
```bash
pnpm install
pnpm codegen        # regenerate typed hooks from the contract schema
pnpm typecheck      # tsc --noEmit (must be clean)
pnpm test           # jest: primitives, parsers, the offline outbox + sync suite
pnpm start          # expo start --dev-client
```
Copy `.env.example` to `.env` and set `GRAPHQL_URL`.

## Architecture (feature-first)
```
src/
  ui/               design-system primitives + tokens + the two motion moments
  app/
    navigation/     the only place routes are registered (5 tabs + stacks + gates)
    providers/      urql client, theme, auth session, connectivity, fonts
  graphql/          urql client, operation .graphql documents, generated hooks
  lib/              format, errors, haptics, secure-store, version gate
  store/            Zustand stores (ui, onboarding, outbox mirror)
  features/<name>/  screens/ components/ hooks/ api/ (+ offline/ for check-in)
```
Each feature exports screens from an `index.ts`; navigators import them. Shared primitives live in `src/ui` — shadow math is never hand-rolled per screen.

## Design system — Soft-Dark Luxury (executed, not defaulted)
- Neumorphic soft surfaces for cards/toggles/tab bar; a FLAT blood-orange (`#C0392B`) primary button. Text and icons are never neumorphic.
- **Six golden rules**: one orange element per screen · primary action bottom, 56px, full-width · max 3 taps for any daily job · luxury = space + silence (24px margins, ≤3 type sizes, calm 300ms) · polish spent ONLY on check-in success + rank-up · serious moments (SOS / refunds / injuries / harassment) drop the theme for plain human screens.
- Numbers are Barlow Condensed SemiBold; everything else Inter. Gold is locked to the #1 rank and Legend coaches.

## Offline check-in (the hard requirement)
A scan enqueues to the SQLite outbox and the success seal shows immediately — the UI never awaits the network. `src/features/checkin/offline/` holds the pure reducer (`outbox.ts`), SQLite persistence (`db.ts`) and the sync engine (`sync.ts`). Sync is idempotent on a device-generated `idempotencyKey`, so an offline scan retried during sync collapses to one check-in. This is the most-tested code in the app.

## Notes / deviations
- No backend is running in this workspace, so screens render their loading/empty/error/offline states; codegen runs fully offline against the local schema file.
- Maps render as tasteful placeholders (real maps need native map config); charts are drawn with plain views (no chart lib).
- Stories are kept as a lightweight typed catalog (`src/ui/stories/*`, `.storybook/types.ts`) rather than bundling the full Storybook runtime.
