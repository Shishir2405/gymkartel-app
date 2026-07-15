import { parseCheckInQr } from "../qr";

describe("parseCheckInQr", () => {
  it("accepts a raw alphanumeric code", () => {
    const r = parseCheckInQr("gk-gym1");
    expect(r.ok).toBe(true);
    expect(r.code).toBe("gk-gym1");
  });

  it("parses a gymkartel:// deep link", () => {
    const r = parseCheckInQr("gymkartel://checkin?code=gk-gym42");
    expect(r.ok).toBe(true);
    expect(r.code).toBe("gk-gym42");
  });

  it("parses an https deep link with the gymkartel host", () => {
    const r = parseCheckInQr("https://gymkartel.app/c?code=abc123");
    expect(r.ok).toBe(true);
    expect(r.code).toBe("abc123");
  });

  it("rejects empty input", () => {
    const r = parseCheckInQr("");
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("empty");
  });

  it("rejects an unrelated URL", () => {
    const r = parseCheckInQr("https://example.com/hello world");
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("unrecognized");
  });

  it("rejects null/undefined safely", () => {
    expect(parseCheckInQr(null).ok).toBe(false);
    expect(parseCheckInQr(undefined).ok).toBe(false);
  });
});
