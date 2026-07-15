import type { CombinedError } from "urql";

/**
 * Typed UI errors mapped from GraphQL extension codes. Screens branch on
 * `UiErrorCode` rather than parsing message strings, so copy stays controlled
 * and human. Serious errors (payment/refund) get plain, non-themed screens.
 */
export type UiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "PAYMENT_FAILED"
  | "TOP_UP_REQUIRED"
  | "PASS_REQUIRED"
  | "OFFLINE"
  | "RATE_LIMITED"
  | "VERSION_UNSUPPORTED"
  | "UNKNOWN";

export interface UiError {
  code: UiErrorCode;
  message: string;
}

const COPY: Record<UiErrorCode, string> = {
  UNAUTHENTICATED: "Your session ended. Sign in again to continue.",
  FORBIDDEN: "You do not have access to this.",
  NOT_FOUND: "We could not find that.",
  PAYMENT_FAILED: "The payment did not go through. No money was taken.",
  TOP_UP_REQUIRED: "This gym is above your pass tier.",
  PASS_REQUIRED: "This opens with a Pass.",
  OFFLINE: "You are offline. This will retry when you are back online.",
  RATE_LIMITED: "Too many attempts. Wait a moment and try again.",
  VERSION_UNSUPPORTED: "This version is no longer supported.",
  UNKNOWN: "Something went wrong. Please try again.",
};

function codeFrom(raw: unknown): UiErrorCode {
  if (typeof raw !== "string") return "UNKNOWN";
  const known: UiErrorCode[] = [
    "UNAUTHENTICATED",
    "FORBIDDEN",
    "NOT_FOUND",
    "PAYMENT_FAILED",
    "TOP_UP_REQUIRED",
    "PASS_REQUIRED",
    "OFFLINE",
    "RATE_LIMITED",
    "VERSION_UNSUPPORTED",
  ];
  return known.includes(raw as UiErrorCode) ? (raw as UiErrorCode) : "UNKNOWN";
}

/** Map an urql CombinedError to a single typed UI error. */
export function toUiError(error: CombinedError | undefined): UiError | null {
  if (!error) return null;
  if (error.networkError) {
    return { code: "OFFLINE", message: COPY.OFFLINE };
  }
  const gql = error.graphQLErrors[0];
  const extCode = gql?.extensions?.["code"];
  const code = codeFrom(extCode);
  return { code, message: COPY[code] };
}

export function errorCopy(code: UiErrorCode): string {
  return COPY[code];
}
