import { formatRupees, formatPerDay, busyLabel } from "../format";
import { passPrice, passPerDayPrice } from "@gymkartel/contracts";

describe("money formatting from the contract source of truth", () => {
  it("formats paise as grouped rupees", () => {
    expect(formatRupees(129900)).toBe("₹1,299");
    expect(formatRupees(9900)).toBe("₹99");
  });

  it("formats a per-day label", () => {
    expect(formatPerDay(9900)).toBe("₹99/day");
  });

  it("renders the ladder prices from contract helpers (never hardcoded)", () => {
    const sevenPerDay = passPerDayPrice("STANDARD", "SEVEN_DAY");
    const fifteenPerDay = passPerDayPrice("STANDARD", "FIFTEEN_DAY");
    expect(fifteenPerDay).toBeLessThan(sevenPerDay);
    expect(passPrice("STANDARD", "FIFTEEN_DAY")).toBeGreaterThan(0);
  });

  it("maps busy fraction to a plain label", () => {
    expect(busyLabel(0.1)).toBe("Quiet");
    expect(busyLabel(0.5)).toBe("Steady");
    expect(busyLabel(0.9)).toBe("Busy");
    expect(busyLabel(null)).toBe("Unknown");
  });
});
