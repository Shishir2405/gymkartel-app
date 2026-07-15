import { useGymsQuery } from "../../../graphql/generated/graphql";
import type { GymCardFragment } from "../../../graphql/generated/graphql";

/**
 * Resolve a scanned check-in code to a known gym from the urql cache. Because
 * the gyms list is cached (cache-and-network), this works OFFLINE for gyms the
 * member has seen — matching the "last-known-good QR cached" requirement. The
 * server is still the authority on top-up at sync time; this is only for the
 * pre-check-in sheet.
 *
 * NOTE: the wire Gym type does not expose the raw checkInCode, so we match on a
 * client convention: the QR code embeds the gymId (checkInCode = `gk-<gymId>`),
 * with a fallback to direct id match for dev codes.
 */
export function useGymByCode() {
  const [{ data }] = useGymsQuery({ variables: { peekOtherTiers: true } });
  const gyms = data?.gyms ?? [];

  function resolve(code: string): GymCardFragment | null {
    const gymId = code.startsWith("gk-") ? code.slice(3) : code;
    return gyms.find((g) => g.id === gymId) ?? null;
  }

  return { resolve };
}
