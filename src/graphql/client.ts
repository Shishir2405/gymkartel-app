import { Client, cacheExchange as defaultCacheExchange, fetchExchange, mapExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { authExchange } from "@urql/exchange-auth";
import Constants from "expo-constants";
import { tokenStore } from "../lib/tokenStore";
import { IS_DEMO } from "../config/appMode";
import { demoExchange } from "./demo/demoExchange";

function graphqlUrl(): string {
  const fromExtra = (Constants.expoConfig?.extra as { graphqlUrl?: string } | undefined)
    ?.graphqlUrl;
  return fromExtra ?? "https://api.gymkartel.app/graphql";
}

const graphcache = cacheExchange({
  keys: {
    Streak: () => null,
    VersionGate: () => null,
    AuthTokens: () => null,
    RazorpayOrder: (data) => (data as { orderId?: string }).orderId ?? null,
    PassLadderRow: (data) => (data as { pack?: string }).pack ?? null,
    TopUpRequired: () => null,
    SyncCheckInResult: () => null,
    ChatThread: (data) => (data as { bookingId?: string }).bookingId ?? null,
    LocationShare: () => null,
    WorkoutChip: () => null,
    Leaderboard: (data) => {
      const d = data as { segment?: string; scopeKey?: string; season?: string };
      return d.segment && d.season ? `${d.segment}:${d.scopeKey ?? ""}:${d.season}` : null;
    },
    LeaderboardEntry: () => null,
    RankCard: () => null,
    RankThreshold: () => null,
    StreakCalendar: () => null,
    GeoPoint: () => null,
    TrustedContact: () => null,
    CoachDashboard: () => null,
    CoachEarnings: () => null,
    CoachCertification: () => null,
    FeatureFlag: (data) => (data as { key?: string }).key ?? null,
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
  if (IS_DEMO) {
    return new Client({
      url: graphqlUrl(),
      exchanges: [graphcache, demoExchange],
      requestPolicy: "cache-and-network",
    });
  }

  return new Client({
    url: graphqlUrl(),
    exchanges: [graphcache, auth, mapExchange({}), fetchExchange],
    requestPolicy: "cache-and-network",
  });
}

export { defaultCacheExchange };
