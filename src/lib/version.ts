export type GateDecision = "ok" | "soft" | "hard";

function parse(v: string): number[] {
  return v.split(".").map((n) => Number.parseInt(n, 10) || 0);
}

export function compareVersions(a: string, b: string): number {
  const pa = parse(a);
  const pb = parse(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function decideGate(
  current: string,
  latest: string,
  minSupported: string,
): GateDecision {
  if (compareVersions(current, minSupported) < 0) return "hard";
  if (compareVersions(latest, current) > 0) return "soft";
  return "ok";
}
