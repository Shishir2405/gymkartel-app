import React from "react";
import { render } from "@testing-library/react-native";
import { ProgressLineChart } from "../ProgressLineChart";

const SAMPLE = [
  { date: "1 Jul", value: 52.5 },
  { date: "6 Jul", value: 55 },
  { date: "10 Jul", value: 57.5 },
  { date: "14 Jul", value: 60 },
];

describe("ProgressLineChart", () => {
  it("renders the real chart when there are at least two points", () => {
    const { getByTestId } = render(<ProgressLineChart points={SAMPLE} unit="kg" />);
    expect(getByTestId("progress-line-chart")).toBeTruthy();
    expect(getByTestId("line-chart-native")).toBeTruthy();
  });

  it("shows a calm empty line instead of a chart when there is no trend yet", () => {
    const { queryByTestId, getByText } = render(
      <ProgressLineChart points={[]} unit="kg" />,
    );
    expect(queryByTestId("progress-line-chart")).toBeNull();
    expect(getByText(/trend draws itself/i)).toBeTruthy();
  });

  it("does not draw a trend from a single point", () => {
    const { queryByTestId } = render(
      <ProgressLineChart points={[{ date: "14 Jul", value: 60 }]} unit="kg" />,
    );
    expect(queryByTestId("progress-line-chart")).toBeNull();
  });
});
