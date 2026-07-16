export interface ParsedQr {
  ok: boolean;
  code: string | null;
  reason?: "empty" | "unrecognized";
}

export function parseCheckInQr(raw: string | null | undefined): ParsedQr {
  if (!raw || raw.trim().length === 0) {
    return { ok: false, code: null, reason: "empty" };
  }
  const value = raw.trim();

  if (value.startsWith("gymkartel://")) {
    const match = value.match(/[?&]code=([^&]+)/);
    const code = match?.[1];
    if (code && code.length > 0) return { ok: true, code: decodeURIComponent(code) };
    return { ok: false, code: null, reason: "unrecognized" };
  }

  if (value.startsWith("https://") && value.includes("gymkartel")) {
    const match = value.match(/[?&]code=([^&]+)/);
    const code = match?.[1];
    if (code && code.length > 0) return { ok: true, code: decodeURIComponent(code) };
    return { ok: false, code: null, reason: "unrecognized" };
  }

  if (/^[A-Za-z0-9_-]{4,64}$/.test(value)) {
    return { ok: true, code: value };
  }

  return { ok: false, code: null, reason: "unrecognized" };
}
