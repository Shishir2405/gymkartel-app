import React from "react";
import { Pressable, Text } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "../AuthProvider";

function Harness() {
  const { status, demoSignIn } = useAuth();
  return (
    <>
      <Text testID="status">{status}</Text>
      <Pressable testID="enter-demo" onPress={() => void demoSignIn()}>
        <Text>Enter demo</Text>
      </Pressable>
    </>
  );
}

describe("AuthProvider.demoSignIn", () => {
  it("marks the session signed-in", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    await waitFor(() => expect(getByTestId("status").props.children).toBe("signedOut"));

    fireEvent.press(getByTestId("enter-demo"));

    await waitFor(() => expect(getByTestId("status").props.children).toBe("signedIn"));
  });
});
