import { computeIsDemo, IS_DEMO } from "../appMode";

/**
 * The mode decision is a pure function of the two build inputs, so it is tested
 * directly without touching process.env / expo-constants. The resolved module
 * constant is checked too: with no env set (the test/prod default) it is false.
 */
describe("appMode.computeIsDemo", () => {
  it("is false when APP_ENV is 'production'", () => {
    expect(computeIsDemo("production", undefined)).toBe(false);
  });

  it("defaults to production (false) when nothing is set", () => {
    expect(computeIsDemo(undefined, undefined)).toBe(false);
  });

  it("treats any non-production APP_ENV as demo", () => {
    expect(computeIsDemo("demo", undefined)).toBe(true);
    expect(computeIsDemo("staging", undefined)).toBe(true);
  });

  it("honours an explicit EXPO_PUBLIC_DEMO=1 flag even under production", () => {
    expect(computeIsDemo("production", "1")).toBe(true);
  });

  it("ignores a demo flag that is not exactly '1'", () => {
    expect(computeIsDemo("production", "0")).toBe(false);
    expect(computeIsDemo("production", "")).toBe(false);
  });

  it("resolves IS_DEMO to false in the test env (no build env set)", () => {
    expect(IS_DEMO).toBe(false);
  });
});
