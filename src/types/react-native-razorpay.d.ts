/**
 * Ambient types for react-native-razorpay.
 *
 * The published package ships JS only (its `main` is `RazorpayCheckout.js` with
 * no `types` field), so we declare the slice of the SDK we actually use. Kept
 * deliberately narrow — the full options surface is large; add fields here as
 * the wrapper needs them.
 */
declare module "react-native-razorpay" {
  export interface RazorpayOptions {
    key: string;
    amount: number | string;
    currency?: string;
    name?: string;
    description?: string;
    image?: string;
    order_id?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
      hide_topbar?: boolean;
    };
  }

  export interface RazorpaySuccess {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }

  export interface RazorpayError {
    code: number;
    description: string;
    reason?: string;
    source?: string;
    step?: string;
  }

  export default class RazorpayCheckout {
    static open(options: RazorpayOptions): Promise<RazorpaySuccess>;
  }
}
