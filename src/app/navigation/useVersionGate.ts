import Constants from "expo-constants";
import { useVersionGateQuery } from "../../graphql/generated/graphql";
import { decideGate, type GateDecision } from "../../lib/version";

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
