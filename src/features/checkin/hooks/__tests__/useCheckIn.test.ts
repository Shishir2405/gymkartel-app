import { renderHook, act } from "@testing-library/react-native";
import { useCheckIn } from "../useCheckIn";
import { useOutboxStore } from "../../../../store/outboxStore";

jest.mock("../../offline/db", () => ({
  outboxDb: { enqueue: jest.fn(async () => undefined) },
}));

beforeEach(() => {
  useOutboxStore.setState({ items: [] });
});

describe("useCheckIn", () => {
  it("reuses a provided idempotencyKey so the top-up order and scan collapse to one", () => {
    const { result } = renderHook(() => useCheckIn());

    let enqueued!: { item: { idempotencyKey: string } };
    act(() => {
      enqueued = result.current.checkIn({
        gymCheckInCode: "GYM-99",
        gymId: "gym-99",
        gymName: "Kartel Strength",
        acceptedTopUp: true,
        idempotencyKey: "shared_key_123",
      });
    });

    expect(enqueued.item.idempotencyKey).toBe("shared_key_123");
    const items = useOutboxStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]?.idempotencyKey).toBe("shared_key_123");
    expect(items[0]?.acceptedTopUp).toBe(true);
  });

  it("generates a fresh key when none is provided", () => {
    const { result } = renderHook(() => useCheckIn());

    let enqueued!: { item: { idempotencyKey: string } };
    act(() => {
      enqueued = result.current.checkIn({
        gymCheckInCode: "GYM-1",
        gymId: "gym-1",
        gymName: "Iron Republic",
        acceptedTopUp: false,
      });
    });

    expect(enqueued.item.idempotencyKey).toMatch(/^ci_/);
  });
});
