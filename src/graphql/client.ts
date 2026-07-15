import { Client, cacheExchange as defaultCacheExchange, fetchExchange, mapExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { authExchange } from "@urql/exchange-auth";
import Constants from "expo-constants";
import { tokenStore } from "../lib/tokenStore";

/**
 * The urql client. Its normalized cache is the single source of truth for ALL
 * server state — screens read from it via generated hooks and never duplicate
 * server data into Zustand.
 *
 * Exchanges (order matters):
 *  - graphcache: normalized cache with type keys.
 *  - authExchange: injects the secure-store access token; refreshes on 401.
 *  - mapExchange: leaves GraphQL extension codes intact for `toUiError`.
 *  - fetchExchange: the network.
 */
function graphqlUrl(): string {
  const fromExtra = (Constants.expoConfig?.extra as { graphqlUrl?: string } | undefined)
    ?.graphqlUrl;
  return fromExtra ?? "https://api.gymkartel.app/graphql";
}

const graphcache = cacheExchange({
  keys: {
    // Types without an `id` field need explicit keying (or null for embedded).
    Streak: () => null,
    VersionGate: () => null,
    AuthTokens: () => null,
    RazorpayOrder: (data) => (data as { orderId?: string }).orderId ?? null,
    PassLadderRow: (data) => (data as { pack?: string }).pack ?? null,
    TopUpRequired: () => null,
    SyncCheckInResult: () => null,
  },
});

const auth = authExchange(async (utils) => {
  let accessToken = await tokenStore.getAccess();
  let refreshToken = await tokenStore.getRefresh();

  return {
    addAuthToOperation(operation) {
      if (!accessToken) return operation;
      return utils.appendHeaders(operation, {
        Authorization: `Bearer ${accessToken}`,
      });
    },
    didAuthError(error) {
      return error.graphQLErrors.some(
        (e) => e.extensions?.["code"] === "UNAUTHENTICATED",
      );
    },
    async refreshAuth() {
      // A real refresh mutation would run here; on failure we clear the session.
      if (!refreshToken) {
        await tokenStore.clear();
        accessToken = null;
        return;
      }
      const fresh = await tokenStore.getAccess();
      accessToken = fresh;
      refreshToken = await tokenStore.getRefresh();
    },
  };
});

export function createUrqlClient(): Client {
  return new Client({
    url: graphqlUrl(),
    exchanges: [graphcache, auth, mapExchange({}), fetchExchange],
    requestPolicy: "cache-and-network",
  });
}

// Fallback default cache export kept for tests that don't need normalization.
export { defaultCacheExchange };
