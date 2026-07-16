import Constants from "expo-constants";

/**
 * App mode selection — the single switch between the two builds:
 *
 *  - **production** (the default): the app talks to the real GraphQL backend,
 *    real OTP, real Razorpay, real Google Maps, camera permission, etc.
 *  - **demo**: a fully offline, self-contained build. Every screen works with
 *    mock data and no backend/keys/permissions/login. This is the APK we hand
 *    to a client to click through.
 *
 * How the mode is chosen (in priority order):
 *  1. `process.env.EXPO_PUBLIC_APP_ENV` / `process.env.EXPO_PUBLIC_DEMO` — Expo
 *     inlines every `EXPO_PUBLIC_*` var into the JS bundle at build time, so
 *     these are the authoritative source in a real build. The `demo` EAS profile
 *     sets `EXPO_PUBLIC_APP_ENV=demo` and `EXPO_PUBLIC_DEMO=1`.
 *  2. `Constants.expoConfig.extra.{appEnv,demo}` — mirrored from the same env in
 *     `app.config.ts`, read at runtime as a fallback (e.g. if a value ever fails
 *     to inline, the manifest still carries it).
 *
 * DEFAULT (no env at all) resolves to PRODUCTION behaviour, so a normal build is
 * never accidentally a demo build.
 */

type Extra = { appEnv?: string; demo?: string } | undefined;

function extra(): Extra {
  return Constants.expoConfig?.extra as Extra;
}

/** Read the raw APP_ENV: inlined env first, then the config mirror. */
function readAppEnv(): string | undefined {
  const fromEnv = process.env.EXPO_PUBLIC_APP_ENV;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  const fromExtra = extra()?.appEnv;
  return fromExtra && fromExtra.length > 0 ? fromExtra : undefined;
}

/** Read the raw DEMO flag: inlined env first, then the config mirror. */
function readDemoFlag(): string | undefined {
  const fromEnv = process.env.EXPO_PUBLIC_DEMO;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return extra()?.demo;
}

/**
 * Pure decision function — exported so it can be unit-tested without touching
 * `process.env` or `expo-constants`. `IS_DEMO` below is exactly this applied to
 * the resolved build inputs.
 */
export function computeIsDemo(
  appEnv: string | undefined,
  demoFlag: string | undefined,
): boolean {
  return demoFlag === "1" || (!!appEnv && appEnv !== "production");
}

/** The resolved app environment, or `undefined` when nothing is set (= prod). */
export const APP_ENV: string | undefined = readAppEnv();

/** True only in a demo build; production stays byte-for-byte unchanged. */
export const IS_DEMO: boolean = computeIsDemo(APP_ENV, readDemoFlag());
