import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Chip } from "../components/Chip";
import { colors } from "../tokens";

describe("Chip", () => {
  it("renders its label and toggles on press", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Chip label="Strength" onPress={onPress} />);
    fireEvent.press(getByText("Strength"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("colors the label orange when selected", () => {
    const { getByText } = render(<Chip label="Selected" selected />);
    const label = getByText("Selected");
    const flat = Array.isArray(label.props.style)
      ? Object.assign({}, ...label.props.style.flat())
      : label.props.style;
    expect(flat.color).toBe(colors.accent.primary);
  });

  it("renders the amber uncertainty marker for parser chips", () => {
    const { getByText } = render(<Chip label="60" uncertain />);
    expect(getByText("?")).toBeTruthy();
  });
});
