# Gym Kartel — End-to-end flows (Maestro)

These are **end-to-end** flows for the critical user journeys. They drive a real
build on a real device/simulator and assert on real UI. They are **separate from
the unit/component tier** (`pnpm test`, jest) and are **NOT part of the CI gate**
— they run **pre-release, against staging**, because they need a native build, a
camera, connectivity toggling, and a seeded backend.

We use **[Maestro](https://maestro.mobile.dev/)** — flat YAML flows that are
authorable and reviewable without a running device (which is why they live in the
repo and get code-reviewed like source).

---

## Why Maestro (not Detox) here

- The flows are declarative and reviewable as text — a reviewer can read
  `checkin-offline.yaml` and see exactly what it asserts without a simulator.
- First-class **airplane-mode** control (`setAirplaneMode`) on Android maps
  directly onto the priority offline check-in scenario.
- No extra native test target / build variant to maintain on top of the
  Expo dev-client build we already ship.
- Selectors are the same `testID`s our jest component tests already use.

Detox remains a reasonable alternative (JS assertions, tighter RN integration).
If you switch, the same `testID`s below are the selectors; the flow *scripts*
would move to `e2e/*.e2e.ts` with a `.detoxrc.js`. We did **not** set Detox up.

---

## Prerequisites

1. **Maestro CLI**
   ```bash
   curl -fsSL "https://get.maestro.mobile.dev" | bash
   maestro --version
   ```
2. **A running dev-client build** of the app (NOT Expo Go — the app uses
   `react-native-vision-camera`, `expo-sqlite`, `expo-secure-store` and
   `react-native-razorpay`, which need a native build):
   ```bash
   pnpm ios      # or: pnpm android
   ```
   App id / bundle id: **`com.gymkartel.app`** (same on both platforms).
3. **A staging API with seeded fixtures.** Point the build at staging:
   ```bash
   GRAPHQL_URL=https://staging-api.gymkartel.app/graphql pnpm ios
   ```
   Required seeded state per flow is listed in the header comment of each YAML
   and summarised under **Seeded fixtures** below.
4. **A simulator/emulator or device** at a target size (below).

---

## Target devices

| Platform | Logical size | Reference device        |
|----------|--------------|-------------------------|
| iOS      | **390×844**  | iPhone 13 / 14          |
| Android  | **360×800**  | Pixel-class 1080×2400 @3x |

These match `app.config.ts` ("Targets: iOS 390x844 … Android 360x800"). Boot the
iOS simulator at iPhone 13/14 and the Android emulator at a 360×800 profile
before running.

---

## Running

Run **all** flows (uses `.maestro/config.yaml` order):
```bash
pnpm e2e
```

Run **one** flow:
```bash
pnpm e2e:flow .maestro/checkin-offline.yaml
```

Override seeded credentials (onboarding):
```bash
pnpm e2e:flow .maestro/onboarding.yaml -e PHONE=98XXXXXXXX -e OTP=000000
```

Maestro Studio (author/inspect selectors live):
```bash
maestro studio
```

---

## The flows

| File                             | Brief scenario covered |
|----------------------------------|------------------------|
| `onboarding.yaml`                | First run: splash → phone+OTP → name/photo → health quiz → pick tier (STANDARD pre-highlighted) → city/zone → Home |
| `buy-pass.yaml`                  | Home "Get your Pass" → pass ladder (15-day MOST CHOSEN pre-selected) → payment → success "Enter the Club" |
| `checkin-offline.yaml`           | **Priority:** open scanner → go offline mid-flow → scan → assert queued + success seal still shows (never blocked on network) → restore connectivity → assert sync |
| `book-coach-chat-masking.yaml`   | Browse coaches → profile → book → pick slot → review & pay → confirmed → open chat → assert typed phone/UPI/link render **masked** + safety strip present |
| `streak-rankup.yaml`             | Club → leaderboards (sticky self row) + rank-up takeover if seeded |

---

## Seeded fixtures (staging)

- **onboarding.yaml** — a test phone number with a fixed/known OTP (`PHONE`,
  `OTP` env, defaults in the file). See **Onboarding deviation** below.
- **buy-pass.yaml** — a signed-in member **without** an active pass (Home shows
  the no-pass hero).
- **checkin-offline.yaml** — a signed-in member **with** an active pass whose
  tier ≥ the seeded gym's tier, plus a **physical/seeded gym QR** to present to
  the camera.
- **book-coach-chat-masking.yaml** — a signed-in member and ≥1 bookable coach
  with availability at a seeded gym.
- **streak-rankup.yaml** — a signed-in member who appears on the leaderboard
  (so the server returns a sticky `self` row). Optionally a seeded rank-up event.

---

## Capabilities that need a manual step

Some capabilities can't be fully scripted; each is called out inline in the YAML
with a `[MANUAL-…]` tag and handled so the run stays deterministic:

- **`[MANUAL-SCAN]`** (checkin-offline) — the QR scan uses the live camera;
  Maestro can't inject a frame. Present the seeded gym door QR during the
  `extendedWaitUntil` window (60s). The decode is offline and pushes the success
  screen with no network round-trip.
- **`[MANUAL-OFFLINE]`** (checkin-offline) — `setAirplaneMode` is **Android-only**
  in Maestro. On **iOS**, toggle airplane mode by hand (Control Center) at the
  two marked steps within the wait windows.
- **`[MANUAL-PAYMENT]`** (buy-pass, book-coach) — the app opens the **native
  Razorpay UPI sheet**, which Maestro can't drive. On a build where the native
  module is absent or configured for the "unavailable" test path, `openCheckout`
  resolves without native UI and the flow proceeds. On a real dev-client build
  with a Razorpay **test** key, complete the sandbox UPI payment manually at the
  marked step, then Maestro resumes.

### Verifying sync server-side
`checkin-offline.yaml` uses the offline banner clearing as the observable proxy
for "synced". Deeper confirmation (streak / leaderboard increment after the
idempotent `SyncCheckIn`) requires asserting against seeded staging data —
extend the flow with a Club → leaderboards assertion once your fixture pins an
expected post-sync count.

### Rank-up takeover
There is no in-session navigation path to the rank-up cinematic; it is pushed by
a seeded rank-up event/server signal. `streak-rankup.yaml` asserts + dismisses it
**only if present** (`runFlow: when: visible`). To force it, seed a check-in that
crosses a rank threshold.

### Onboarding deviation
The auth gate flips to the member app the instant the OTP is verified
(`signIn → status = "signedIn"` in `AuthProvider`, switched in `RootNavigator`).
On the current build the screens **after** OTP (name/photo → city/zone) are only
reachable if staging withholds `signedIn` until the profile is completed, or the
`RootNavigator` gains a `needsOnboarding` hold. `onboarding.yaml` is authored to
the brief's intended full sequence and the real `testID`s; if your build jumps to
Home right after OTP, the run stops cleanly at the Home assertion tagged
`[POST-OTP-GATE]`. This was **not** changed here — it is auth/navigation wiring
outside the scope of adding e2e coverage.

---

## testID convention

Selectors are stable `testID`s. Convention:

```
testID = "<screen>.<element>"     e.g. "phone-otp.submit", "pick-slot.time.6"
```

- `<screen>` is the kebab-case screen/route name; the screen's **container** uses
  the bare id (`"phone-otp"`, `"scanner"`, `"leaderboards"`).
- Repeated/parameterised elements append the key: `pick-tier.tier.STANDARD`,
  `pass-ladder.pack.FIFTEEN_DAY`, `payment.method.gpay`, `tab.CheckIn`,
  `coach-card.<coachId>`, `club.nav.Leaderboards`.
- Some pre-existing screen containers already followed this (`club-home`,
  `leaderboards`, `card-gallery`, `territory-wars`, `streak-calendar`) and are
  reused as-is.
- Accessibility labels remain the selector for icon-only controls that already
  had them (e.g. "Message coach", "Send", "Add a photo", "Check in").

### testIDs by screen

**Shared primitives** (now accept a `testID` prop): `IconButton`, `PressableRow`,
plus the tab bar `tab.<RouteName>` (`tab.Home`, `tab.Gyms`, `tab.CheckIn`,
`tab.Track`, `tab.Club`) and `offline-banner`.

- **Splash** — `splash`, `splash.enter`
- **PhoneOtp** — `phone-otp`, `phone-otp.phone-input`, `phone-otp.otp-input`, `phone-otp.submit`
- **NamePhoto** — `name-photo`, `name-photo.photo`, `name-photo.name-input`, `name-photo.continue`
- **HealthQuiz** — `health-quiz`, `health-quiz.goal.<GOAL>`, `health-quiz.experience.<EXP>`, `health-quiz.days.<n>`, `health-quiz.injuries-input`, `health-quiz.primary`
- **PickTier** — `pick-tier`, `pick-tier.tier.<TIER>`, `pick-tier.continue`
- **CityZone** — `city-zone`, `city-zone.search`, `city-zone.zone.<zone>`, `city-zone.enter`
- **Home** — `home`, `home.get-pass`
- **PassLadder** — `pass-ladder`, `pass-ladder.pack.<PACK>`, `pass-ladder.get-pass`
- **Payment** — `payment`, `payment.method.<id>`, `payment.pay`, `payment.retry`
- **PurchaseSuccess** — `purchase-success`, `purchase-success.enter`
- **Scanner** — `scanner`, `scanner.close`, `scanner.allow-camera`, `scanner.hint`, `scanner.offline-hint`
- **TopUpSheet** — `top-up.confirm`
- **CheckInSuccess** — `check-in-success`, `check-in-success.record`, `check-in-success.share`, `check-in-success.customise`, `check-in-success.done`
- **CoachBrowse** — `coach-browse`, `coach-card.<coachId>`
- **CoachProfile** — `coach-profile`, `coach-profile.book`, `coach-profile.chat`
- **PickSlot** — `pick-slot`, `pick-slot.date.<i>`, `pick-slot.time.<hour>`, `pick-slot.gym.<gymId>`, `pick-slot.continue`
- **ReviewPay** — `review-pay`, `review-pay.method.<id>`, `review-pay.pay`
- **BookingConfirmed** — `booking-confirmed`, `booking-confirmed.message`
- **ChatThread** — `chat-thread`, `chat.safety-strip`, `chat.message`, `chat.message-text`, `chat.input`, `chat.send`
- **ClubHome** — `club-home`, `club.nav.<Destination>`
- **Leaderboards** — `leaderboards`, `leaderboards.segment.<segment>`, `leaderboards.self`
- **RankUp** — `rank-up`, `rank-up.continue`
