import { useGymsQuery } from "../../../graphql/generated/graphql";
import type { GymCardFragment } from "../../../graphql/generated/graphql";

export function useGymByCode() {
  const [{ data }] = useGymsQuery({ variables: { peekOtherTiers: true } });
  const gyms = data?.gyms ?? [];

  function resolve(code: string): GymCardFragment | null {
    const gymId = code.startsWith("gk-") ? code.slice(3) : code;
    return gyms.find((g) => g.id === gymId) ?? null;
  }

  return { resolve };
}
