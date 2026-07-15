import {
  openCheckout,
  setRazorpayGatewayForTesting,
  type RazorpayGateway,
  type CheckoutRequest,
} from "../payments";

const baseReq: CheckoutRequest = {
  orderId: "order_123",
  amountPaise: 14900,
  name: "Gym Kartel",
  description: "Gym Kartel pass",
};

/** A gateway whose single `open` call resolves or rejects with the given value. */
function gateway(impl: RazorpayGateway["open"]): RazorpayGateway {
  return { open: jest.fn(impl) };
}

afterEach(() => {
  // Reset so the next call re-probes (and other suites aren't affected).
  setRazorpayGatewayForTesting(undefined);
});

describe("payments.openCheckout", () => {
  it("maps a resolved Razorpay success into a typed success result", async () => {
    setRazorpayGatewayForTesting(
      gateway(async () => ({
        razorpay_payment_id: "pay_abc",
        razorpay_order_id: "order_123",
        razorpay_signature: "sig_xyz",
      })),
    );

    const result = await openCheckout(baseReq);
    expect(result).toEqual({
      status: "success",
      paymentId: "pay_abc",
      orderId: "order_123",
      signature: "sig_xyz",
    });
  });

  it("passes the order id, amount and currency through to the gateway", async () => {
    const open = jest.fn(async (_options: unknown) => ({ razorpay_payment_id: "pay_1" }));
    setRazorpayGatewayForTesting({ open });

    await openCheckout(baseReq);

    expect(open).toHaveBeenCalledTimes(1);
    const options = open.mock.calls[0]?.[0];
    expect(options).toMatchObject({
      order_id: "order_123",
      amount: 14900,
      currency: "INR",
      name: "Gym Kartel",
    });
  });

  it("classifies a user dismiss (code 0 / cancelled) as cancelled", async () => {
    setRazorpayGatewayForTesting(
      gateway(async () => {
        throw { code: 0, description: "Payment Cancelled by user" };
      }),
    );
    expect(await openCheckout(baseReq)).toEqual({ status: "cancelled" });
  });

  it("classifies a cancelled reason string as cancelled", async () => {
    setRazorpayGatewayForTesting(
      gateway(async () => {
        throw { code: 2, description: "Something", reason: "payment_cancelled" };
      }),
    );
    expect(await openCheckout(baseReq)).toEqual({ status: "cancelled" });
  });

  it("maps a genuine gateway error into a failed result with code + description", async () => {
    setRazorpayGatewayForTesting(
      gateway(async () => {
        throw { code: 401, description: "Payment failed at bank" };
      }),
    );
    expect(await openCheckout(baseReq)).toEqual({
      status: "failed",
      code: 401,
      description: "Payment failed at bank",
    });
  });

  it("falls back to a friendly message when the error carries no description", async () => {
    setRazorpayGatewayForTesting(
      gateway(async () => {
        throw new Error("boom");
      }),
    );
    const result = await openCheckout(baseReq);
    expect(result).toEqual({
      status: "failed",
      code: null,
      description: "The payment did not go through.",
    });
  });

  it("returns unavailable when no native gateway is present", async () => {
    setRazorpayGatewayForTesting(null);
    expect(await openCheckout(baseReq)).toEqual({ status: "unavailable" });
  });
});
