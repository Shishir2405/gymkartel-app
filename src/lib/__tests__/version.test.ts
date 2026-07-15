import { compareVersions, decideGate } from "../version";

describe("version gate", () => {
  it("compares dotted versions", () => {
    expect(compareVersions("1.2.0", "1.2.0")).toBe(0);
    expect(compareVersions("1.3.0", "1.2.9")).toBeGreaterThan(0);
    expect(compareVersions("1.2.0", "1.10.0")).toBeLessThan(0);
  });

  it("passes when current is latest and supported", () => {
    expect(decideGate("1.2.0", "1.2.0", "1.0.0")).toBe("ok");
  });

  it("soft-prompts when a newer version exists", () => {
    expect(decideGate("1.2.0", "1.3.0", "1.0.0")).toBe("soft");
  });

  it("hard-gates when current is below minSupported", () => {
    expect(decideGate("0.9.0", "1.3.0", "1.0.0")).toBe("hard");
  });
});
