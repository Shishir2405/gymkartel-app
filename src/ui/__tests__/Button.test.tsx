import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../components/Button";

/**
 * The four button variants are executable specs — rest / pressed / disabled.
 */
describe("Button", () => {
  it("renders its label and fires onPress at rest", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Get your Pass" onPress={onPress} />);
    fireEvent.press(getByText("Get your Pass"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not fire onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByText, getByRole } = render(
      <Button label="Pay" onPress={onPress} disabled testID="btn" />,
    );
    fireEvent.press(getByText("Pay"));
    expect(onPress).not.toHaveBeenCalled();
    expect(getByRole("button").props.accessibilityState.disabled).toBe(true);
  });

  it("shows a busy state while loading and blocks presses", () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button label="Verify" onPress={onPress} loading />);
    expect(getByRole("button").props.accessibilityState.busy).toBe(true);
    fireEvent.press(getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders each variant without crashing", () => {
    for (const variant of ["primary", "secondary", "ghost", "destructive"] as const) {
      const { getByText } = render(<Button label={variant} onPress={() => {}} variant={variant} />);
      expect(getByText(variant)).toBeTruthy();
    }
  });
});
