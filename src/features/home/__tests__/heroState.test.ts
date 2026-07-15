import { selectHeroState } from "../hooks/heroState";

describe("Home hero swap (has-pass vs no-pass)", () => {
  it("shows the pass hero when the pass is ACTIVE", () => {
    expect(selectHeroState({ activePass: { status: "ACTIVE" } })).toBe("hasPass");
  });

  it("shows the no-pass hero when there is no pass", () => {
    expect(selectHeroState({ activePass: null })).toBe("noPass");
    expect(selectHeroState({})).toBe("noPass");
    expect(selectHeroState(null)).toBe("noPass");
    expect(selectHeroState(undefined)).toBe("noPass");
  });

  it("shows the no-pass hero for expired/exhausted passes (they open the ladder)", () => {
    expect(selectHeroState({ activePass: { status: "EXPIRED" } })).toBe("noPass");
    expect(selectHeroState({ activePass: { status: "EXHAUSTED" } })).toBe("noPass");
  });
});
