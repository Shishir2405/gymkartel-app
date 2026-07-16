
const MASK = "•••";

const EMAIL_RE =
  /[A-Z0-9._%+-]+\s*(?:@|\(at\)|\[at\]|\bat\b)\s*[A-Z0-9.-]+\s*(?:\.|\(dot\)|\[dot\]|\bdot\b)\s*[A-Z]{2,}/gi;

const URL_RE =
  /\b(?:(?:https?:\/\/|www\.)[^\s]+|[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.(?:com|net|org|io|co|in|me|app|dev|xyz|link|gg|ly|to|info|biz|online|site|shop|store)(?:\/[^\s]*)?)\b/gi;

const HANDLE_RE =
  /(?:@[A-Z0-9._]{2,})|(?:\b(?:whatsapp|telegram|insta(?:gram)?|snap(?:chat)?|signal)\b\s*[:\-]?\s*[A-Z0-9._@+]{2,})/gi;

const PHONE_RE =
  /(?:\+?\(?\d[\d\s().-]{5,}\d)/g;

function hasEnoughDigits(token: string): boolean {
  const digits = token.replace(/\D/g, "");
  return digits.length >= 7;
}

export function maskPii(text: string): string {
  if (!text) return text;

  let out = text;

  out = out.replace(EMAIL_RE, MASK);
  out = out.replace(URL_RE, MASK);
  out = out.replace(HANDLE_RE, MASK);
  out = out.replace(PHONE_RE, (m) => (hasEnoughDigits(m) ? MASK : m));

  if (out.includes(MASK)) {
    out = out.replace(new RegExp(`(?:${MASK}\\s*){2,}`, "g"), `${MASK} `).trimEnd();
  }

  return out;
}

export function containsPii(text: string): boolean {
  if (!text) return false;
  return maskPii(text) !== text;
}
