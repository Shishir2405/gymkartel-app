import Constants from "expo-constants";

type Extra = { appEnv?: string; demo?: string } | undefined;

function extra(): Extra {
  return Constants.expoConfig?.extra as Extra;
}

function readAppEnv(): string | undefined {
  const fromEnv = process.env.EXPO_PUBLIC_APP_ENV;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  const fromExtra = extra()?.appEnv;
  return fromExtra && fromExtra.length > 0 ? fromExtra : undefined;
}

function readDemoFlag(): string | undefined {
  const fromEnv = process.env.EXPO_PUBLIC_DEMO;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return extra()?.demo;
}

export function computeIsDemo(
  appEnv: string | undefined,
  demoFlag: string | undefined,
): boolean {
  return demoFlag === "1" || (!!appEnv && appEnv !== "production");
}

export const APP_ENV: string | undefined = readAppEnv();

export const IS_DEMO: boolean = computeIsDemo(APP_ENV, readDemoFlag());
