import { useViewerQuery, useGymsQuery, useBookingsQuery } from "../../../graphql/generated/graphql";

export function useHome() {
  const [viewer] = useViewerQuery();
  const [gyms] = useGymsQuery({ variables: {} });
  const [bookings] = useBookingsQuery();

  const nextBooking = (bookings.data?.bookings ?? [])
    .filter((b) => b.status === "CONFIRMED")
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0];

  return {
    viewer: viewer.data?.viewer ?? null,
    gyms: gyms.data?.gyms ?? [],
    nextBooking: nextBooking ?? null,
    fetching: viewer.fetching,
    error: viewer.error,
    stale: viewer.stale,
  };
}
