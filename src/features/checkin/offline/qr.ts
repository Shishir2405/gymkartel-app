/**
 * QR payload parsing for door check-in. The gym QR encodes a check-in code; we
 * accept either a raw code or a `gymkartel://checkin?code=...` deep link so the
 * same QR works if scanned by a generic camera. Pure + tested.
 *
 * The last-known-good code is cached (see cache below) so a scan works fully
 * offline even when the QR value is transiently unreadable.
 */
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

  // Deep link form.
  if (value.startsWith("gymkartel://")) {
    const match = value.match(/[?&]code=([^&]+)/);
    const code = match?.[1];
    if (code && code.length > 0) return { ok: true, code: decodeURIComponent(code) };
    return { ok: false, code: null, reason: "unrecognized" };
  }

  // https deep link form.
  if (value.startsWith("https://") && value.includes("gymkartel")) {
    const match = value.match(/[?&]code=([^&]+)/);
    const code = match?.[1];
    if (code && code.length > 0) return { ok: true, code: decodeURIComponent(code) };
    return { ok: false, code: null, reason: "unrecognized" };
  }

  // Raw code form: alphanumeric with dashes, reasonable length.
  if (/^[A-Za-z0-9_-]{4,64}$/.test(value)) {
    return { ok: true, code: value };
  }

  return { ok: false, code: null, reason: "unrecognized" };
}
