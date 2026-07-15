/**
 * PII masking for in-app chat.
 *
 * The product rule: members and coaches must not exchange phone numbers, email
 * addresses, or off-platform links inside the chat — moving a conversation off
 * the platform strips away the booking's safety net (insurance, SOS, incident
 * reporting). So EVERY rendered message body — incoming and outgoing — is passed
 * through `maskPii` before display. Masking is presentational only; we never
 * mutate what the user typed, we only mask what is shown.
 *
 * The mask is deliberately conservative: it favours over-masking a borderline
 * token (e.g. a long digit run) over letting a real contact detail slip past.
 */

const MASK = "•••"; // •••

// Emails: local@domain.tld — matched first so the domain isn't caught as a URL.
const EMAIL_RE =
  /[A-Z0-9._%+-]+\s*(?:@|\(at\)|\[at\]|\bat\b)\s*[A-Z0-9.-]+\s*(?:\.|\(dot\)|\[dot\]|\bdot\b)\s*[A-Z]{2,}/gi;

// URLs / links: with scheme, with www., or a bare domain with a known-ish TLD.
const URL_RE =
  /\b(?:(?:https?:\/\/|www\.)[^\s]+|[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.(?:com|net|org|io|co|in|me|app|dev|xyz|link|gg|ly|to|info|biz|online|site|shop|store)(?:\/[^\s]*)?)\b/gi;

// Social / messaging handles that are really "reach me off-platform" pointers.
const HANDLE_RE =
  /(?:@[A-Z0-9._]{2,})|(?:\b(?:whatsapp|telegram|insta(?:gram)?|snap(?:chat)?|signal)\b\s*[:\-]?\s*[A-Z0-9._@+]{2,})/gi;

// Phone numbers: 7+ digits total, allowing +, spaces, dashes, dots, parens, and
// digit-words are handled separately. Requires enough digits to be a real number.
const PHONE_RE =
  /(?:\+?\(?\d[\d\s().-]{5,}\d)/g;

/** True when at least 7 digits appear in the token (a plausible phone number). */
function hasEnoughDigits(token: string): boolean {
  const digits = token.replace(/\D/g, "");
  return digits.length >= 7;
}

/**
 * Replace every phone number, email address, URL/link, or off-platform handle in
 * `text` with a "•••" mask. Applied on render to every message, both directions.
 */
export function maskPii(text: string): string {
  if (!text) return text;

  let out = text;

  // Order matters: emails first, then full URLs (so "insta.com/handle" is taken
  // whole, not half-eaten by the handle matcher), then bare handles, then phones
  // last (so "site.com/123456789" isn't split by the phone matcher).
  out = out.replace(EMAIL_RE, MASK);
  out = out.replace(URL_RE, MASK);
  out = out.replace(HANDLE_RE, MASK);
  out = out.replace(PHONE_RE, (m) => (hasEnoughDigits(m) ? MASK : m));

  // Only tidy up if we actually masked something — never alter clean text, so
  // `containsPii` stays an exact "changed?" comparison.
  if (out.includes(MASK)) {
    // Collapse runs of adjacent masks (e.g. "••• •••") into a single mask.
    out = out.replace(new RegExp(`(?:${MASK}\\s*){2,}`, "g"), `${MASK} `).trimEnd();
  }

  return out;
}

/** True if the text contains any maskable PII. Cheap check for input warnings. */
export function containsPii(text: string): boolean {
  if (!text) return false;
  return maskPii(text) !== text;
}
