import Constants from "expo-constants";
import type {
  RazorpayOptions,
  RazorpaySuccess,
  RazorpayError,
} from "react-native-razorpay";
import { colors } from "@/ui/tokens";
import { IS_DEMO } from "@/config/appMode";

export interface RazorpayGateway {
  open(options: RazorpayOptions): Promise<RazorpaySuccess>;
}

export interface CheckoutRequest {
  orderId: string | null;
  amountPaise: number;
  currency?: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  themeColor?: string;
}

export type CheckoutResult =
  | { status: "success"; paymentId: string; orderId: string | null; signature: string | null }
  | { status: "cancelled" }
  | { status: "failed"; code: number | null; description: string }
  | { status: "unavailable" };

function razorpayKeyId(): string {
  const extra = Constants.expoConfig?.extra as { razorpayKeyId?: string } | undefined;
  return extra?.razorpayKeyId ?? "";
}

let cachedGateway: RazorpayGateway | null | undefined;

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

export function setRazorpayGatewayForTesting(
  gateway: RazorpayGateway | null | undefined,
): void {
  cachedGateway = gateway;
}

function isCancellation(err: Partial<RazorpayError>): boolean {
  const reason = (err.reason ?? "").toLowerCase();
  const description = (err.description ?? "").toLowerCase();
  return err.code === 0 || reason.includes("cancel") || description.includes("cancel");
}

export async function openCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
  if (IS_DEMO) {
    return {
      status: "success",
      paymentId: `pay_demo_${Date.now()}`,
      orderId: req.orderId,
      signature: null,
    };
  }

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
