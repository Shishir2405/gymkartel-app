import Constants from "expo-constants";
import type {
  RazorpayOptions,
  RazorpaySuccess,
  RazorpayError,
} from "react-native-razorpay";
import { colors } from "@/ui/tokens";

/**
 * Thin, typed wrapper around the Razorpay UPI checkout.
 *
 * The native SDK only exists in a dev-client / production native build — it is
 * NOT in Expo Go, JSDOM, or the Jest env. So the module is resolved lazily and,
 * when absent, `openCheckout` returns `{ status: "unavailable" }` rather than
 * throwing. Screens treat that as "no native gateway here" and keep their
 * existing optimistic flow; unit tests inject a fake gateway to exercise the
 * success / cancelled / failed mappings.
 *
 * IMPORTANT: a client-side `success` is NOT proof of payment. The server is the
 * source of truth and reconciles via the Razorpay webhook. Callers should treat
 * `success` only as "proceed to await/poll server confirmation".
 */

/** The minimal gateway shape we depend on (matches RazorpayCheckout.open). */
export interface RazorpayGateway {
  open(options: RazorpayOptions): Promise<RazorpaySuccess>;
}

export interface CheckoutRequest {
  /** Razorpay order id from the backend order-creation mutation, when available. */
  orderId: string | null;
  amountPaise: number;
  currency?: string;
  /** Merchant name shown in the sheet. */
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  /** Accent colour for the checkout theme (defaults to the brand orange). */
  themeColor?: string;
}

export type CheckoutResult =
  | { status: "success"; paymentId: string; orderId: string | null; signature: string | null }
  | { status: "cancelled" }
  | { status: "failed"; code: number | null; description: string }
  | { status: "unavailable" };

/** Publishable Razorpay key id — safe to ship; the secret never leaves the server. */
function razorpayKeyId(): string {
  const extra = Constants.expoConfig?.extra as { razorpayKeyId?: string } | undefined;
  return extra?.razorpayKeyId ?? "";
}

let cachedGateway: RazorpayGateway | null | undefined;

/** Lazily resolve the native SDK; cached so we only probe once. */
function resolveGateway(): RazorpayGateway | null {
  if (cachedGateway !== undefined) return cachedGateway;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("react-native-razorpay") as
      | { default?: RazorpayGateway }
      | RazorpayGateway;
    const gw =
      "default" in mod && mod.default ? mod.default : (mod as RazorpayGateway);
    cachedGateway = gw && typeof gw.open === "function" ? gw : null;
  } catch {
    cachedGateway = null;
  }
  return cachedGateway;
}

/**
 * Override the resolved gateway. Tests inject a fake; pass `undefined` to reset
 * so the next call probes the real module again.
 */
export function setRazorpayGatewayForTesting(
  gateway: RazorpayGateway | null | undefined,
): void {
  cachedGateway = gateway;
}

/** Classify a Razorpay reject as a user cancellation vs a genuine failure. */
function isCancellation(err: Partial<RazorpayError>): boolean {
  const reason = (err.reason ?? "").toLowerCase();
  const description = (err.description ?? "").toLowerCase();
  // Razorpay signals a user dismiss with code 0 or a "cancelled" reason/description.
  return err.code === 0 || reason.includes("cancel") || description.includes("cancel");
}

/**
 * Open the UPI checkout and map the SDK's resolve/reject into a small, typed
 * result union. Never throws.
 */
export async function openCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
  const gateway = resolveGateway();
  if (!gateway) return { status: "unavailable" };

  const options: RazorpayOptions = {
    key: razorpayKeyId(),
    name: req.name,
    description: req.description,
    amount: req.amountPaise,
    currency: req.currency ?? "INR",
    theme: { color: req.themeColor ?? colors.accent.primary },
    ...(req.orderId ? { order_id: req.orderId } : {}),
    ...(req.prefill ? { prefill: req.prefill } : {}),
  };

  try {
    const data = await gateway.open(options);
    return {
      status: "success",
      paymentId: data.razorpay_payment_id,
      orderId: data.razorpay_order_id ?? null,
      signature: data.razorpay_signature ?? null,
    };
  } catch (e) {
    const err = (e ?? {}) as Partial<RazorpayError>;
    if (isCancellation(err)) return { status: "cancelled" };
    return {
      status: "failed",
      code: typeof err.code === "number" ? err.code : null,
      description:
        typeof err.description === "string" && err.description.length > 0
          ? err.description
          : "The payment did not go through.",
    };
  }
}
