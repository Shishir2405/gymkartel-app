import { Client } from "urql";
import { demoExchange } from "../demoExchange";
import {
  ViewerDocument,
  RequestOtpDocument,
  GymsDocument,
} from "@/graphql/generated/graphql";

/**
 * A demo client wired with ONLY the demoExchange — no fetch/auth/subscription
 * exchange, so any result must have come from the local fixtures.
 */
function demoClient(): Client {
  return new Client({ url: "http://demo.local/graphql", exchanges: [demoExchange] });
}

describe("demoExchange", () => {
  it("resolves a query from fixtures without any network", async () => {
    const client = demoClient();
    const result = await client.query(ViewerDocument, {}).toPromise();

    expect(result.error).toBeUndefined();
    expect(result.data?.viewer?.id).toBe("user_ravi");
    expect(result.data?.viewer?.tier).toBe("PREMIUM");
    expect(result.data?.viewer?.activePass?.status).toBe("ACTIVE");
  });

  it("resolves a list query from fixtures", async () => {
    const client = demoClient();
    const result = await client.query(GymsDocument, {}).toPromise();

    expect(result.error).toBeUndefined();
    expect(Array.isArray(result.data?.gyms)).toBe(true);
    expect(result.data?.gyms.length).toBeGreaterThan(0);
    expect(result.data?.gyms[0]?.name).toBe("Iron Republic");
  });

  it("resolves a mutation from fixtures without any network", async () => {
    const client = demoClient();
    const result = await client
      .mutation(RequestOtpDocument, { input: { phone: "+919999999999" } })
      .toPromise();

    expect(result.error).toBeUndefined();
    expect(result.data?.requestOtp).toBe(true);
  });
});
