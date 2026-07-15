import Constants from "expo-constants";
import { useVersionGateQuery } from "../../graphql/generated/graphql";
import { decideGate, type GateDecision } from "../../lib/version";

/**
 * Section 6 version gate. Compares this build's version against the server's
 * latest/minSupported. Returns "hard" (block), "soft" (dismissible prompt) or
 * "ok". Until the query resolves (or if it errors, e.g. offline) we fail OPEN
 * ("ok") so connectivity never traps a user out of the app.
 */
export function useVersionGate(): { decision: GateDecision; latest: string } {
  const current = Constants.expoConfig?.version ?? "0.1.0";
  const [{ data }] = useVersionGateQuery();
  const gate = data?.versionGate;
  if (!gate) return { decision: "ok", latest: current };
  return {
    decision: decideGate(current, gate.latestVersion, gate.minSupportedVersion),
    latest: gate.latestVersion,
  };
}
