import React from "react";
import { render } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ChatThreadScreen } from "../ChatThreadScreen";
import type { MemberScreenProps } from "@/app/navigation/types";
import * as gql from "@/graphql/generated/graphql";

jest.mock("@/graphql/generated/graphql", () => ({
  __esModule: true,
  ...jest.requireActual("@/graphql/generated/graphql"),
  useBookingsQuery: jest.fn(),
  useViewerQuery: jest.fn(),
  useChatThreadQuery: jest.fn(),
  useSendMessageMutation: jest.fn(),
  useMessageReceivedSubscription: jest.fn(),
}));

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function makeProps(): MemberScreenProps<"ChatThread"> {
  const nav = { navigate: jest.fn(), goBack: jest.fn() };
  return {
    navigation: nav,
    route: { key: "k", name: "ChatThread", params: { bookingId: "b1", peerName: "Arjun" } },
  } as unknown as MemberScreenProps<"ChatThread">;
}

function renderScreen() {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ChatThreadScreen {...makeProps()} />
    </SafeAreaProvider>,
  );
}

describe("ChatThreadScreen", () => {
  beforeEach(() => {
    (gql.useBookingsQuery as jest.Mock).mockReturnValue([
      { data: { bookings: [{ id: "b1", chatUnlocked: true }] }, fetching: false, error: undefined },
      jest.fn(),
    ]);
    (gql.useViewerQuery as jest.Mock).mockReturnValue([
      { data: { viewer: { id: "me" } }, fetching: false, error: undefined },
      jest.fn(),
    ]);
    (gql.useSendMessageMutation as jest.Mock).mockReturnValue([{ fetching: false }, jest.fn()]);
    (gql.useMessageReceivedSubscription as jest.Mock).mockReturnValue([{ data: undefined }]);
  });

  it("keeps the safety masking strip and masks PII in message bodies", () => {
    (gql.useChatThreadQuery as jest.Mock).mockReturnValue([
      {
        data: {
          chatThread: [
            {
              __typename: "ChatMessage",
              id: "m1",
              bookingId: "b1",
              from: "coach",
              text: "Reach me on 9876543210 anytime",
              masked: false,
              sentAt: "2026-07-15T09:00:00.000Z",
            },
          ],
        },
        fetching: false,
        error: undefined,
      },
      jest.fn(),
    ]);

    const { getByText, queryByText } = renderScreen();
    expect(getByText("Numbers and links are hidden for your safety.")).toBeTruthy();
    expect(queryByText(/9876543210/)).toBeNull();
  });
});
