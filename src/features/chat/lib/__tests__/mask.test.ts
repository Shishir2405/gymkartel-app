import { maskPii, containsPii } from "../mask";

const MASK = "•••";

describe("maskPii", () => {
  it("masks Indian mobile numbers in various formats", () => {
    expect(maskPii("call me on 9876543210")).toBe(`call me on ${MASK}`);
    expect(maskPii("+91 98765 43210")).toBe(MASK);
    expect(maskPii("reach 98765-43210 anytime")).toBe(`reach ${MASK} anytime`);
    expect(maskPii("(022) 2345 6789")).toBe(MASK);
  });

  it("does not mask short digit runs like reps or times", () => {
    expect(maskPii("did 12 reps")).toBe("did 12 reps");
    expect(maskPii("meet at 6")).toBe("meet at 6");
    expect(maskPii("set 3 x 10")).toBe("set 3 x 10");
  });

  it("masks email addresses including obfuscated ones", () => {
    expect(maskPii("mail me coach@gym.com please")).toBe(`mail me ${MASK} please`);
    expect(maskPii("coach (at) gym (dot) com")).toBe(MASK);
    expect(maskPii("name.surname+tag@sub.domain.co.in")).toBe(MASK);
  });

  it("masks urls and bare domains", () => {
    expect(maskPii("see https://evil.example.com/pay now")).toBe(`see ${MASK} now`);
    expect(maskPii("go to www.some-site.io")).toBe(`go to ${MASK}`);
    expect(maskPii("dm me on insta.com/handle")).toBe(`dm me on ${MASK}`);
  });

  it("masks off-platform handles", () => {
    expect(maskPii("whatsapp me 9876543210")).toContain(MASK);
    expect(maskPii("i am @coach_rahul on there")).toBe(`i am ${MASK} on there`);
    expect(maskPii("telegram: rahulfit")).toBe(MASK);
  });

  it("masks in both directions regardless of who sent it", () => {
    const incoming = "here is my number 9998887776";
    const outgoing = "ok mine is 8887776665";
    expect(maskPii(incoming)).toBe(`here is my number ${MASK}`);
    expect(maskPii(outgoing)).toBe(`ok mine is ${MASK}`);
  });

  it("collapses multiple pieces of pii in one message", () => {
    const out = maskPii("9876543210 or coach@gym.com");
    expect(out).toContain(MASK);
    expect(out).not.toMatch(/\d{7}/);
    expect(out).not.toContain("@gym.com");
  });

  it("leaves clean text untouched", () => {
    const clean = "Great session today, see you Tuesday.";
    expect(maskPii(clean)).toBe(clean);
    expect(maskPii("")).toBe("");
    expect(maskPii("trailing space ")).toBe("trailing space ");
  });
});

describe("containsPii", () => {
  it("is true when pii is present", () => {
    expect(containsPii("ring 9876543210")).toBe(true);
    expect(containsPii("mail coach@gym.com")).toBe(true);
    expect(containsPii("visit www.site.com")).toBe(true);
  });

  it("is false for clean text", () => {
    expect(containsPii("see you at the gym")).toBe(false);
    expect(containsPii("did 12 reps at 6")).toBe(false);
    expect(containsPii("")).toBe(false);
  });
});
