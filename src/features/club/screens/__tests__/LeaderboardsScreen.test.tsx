import React from "react";
import { render } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LeaderboardsScreen } from "../LeaderboardsScreen";
import type { MemberScreenProps } from "@/app/navigation/types";
import * as gql from "@/graphql/generated/graphql";

jest.mock("@/graphql/generated/graphql", () => ({
  __esModule: true,
  ...jest.requireActual("@/graphql/generated/graphql"),
  useLeaderboardQuery: jest.fn(),
}));

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function makeProps(): MemberScreenProps<"Leaderboards"> {
  const nav = { navigate: jest.fn(), goBack: jest.fn() };
  return { navigation: nav, route: { key: "k", name: "Leaderboards", params: undefined } } as unknown as MemberScreenProps<"Leaderboards">;
}

function renderScreen() {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <LeaderboardsScreen {...makeProps()} />
    </SafeAreaProvider>,
  );
}

describe("LeaderboardsScreen", () => {
  it("pins the viewer's sticky self row when they fall outside the page", () => {
    (gql.useLeaderboardQuery as jest.Mock).mockReturnValue([
      {
        data: {
          leaderboard: {
            __typename: "Leaderboard",
            segment: gql.LeaderboardSegment.Zone,
            scopeKey: "bandra",
            season: "2026-07",
            page: [
              { __typename: "LeaderboardEntry", userId: "u1", displayName: "Arjun Nair", streak: 6, totalCheckIns: 61, position: 1, isSelf: false },
              { __typename: "LeaderboardEntry", userId: "u2", displayName: "Sana Kapoor", streak: 5, totalCheckIns: 58, position: 2, isSelf: false },
              { __typename: "LeaderboardEntry", userId: "u3", displayName: "Vikram Rao", streak: 4, totalCheckIns: 54, position: 3, isSelf: false },
              { __typename: "LeaderboardEntry", userId: "u4", displayName: "Neha Iyer", streak: 3, totalCheckIns: 49, position: 4, isSelf: false },
            ],
            self: { __typename: "LeaderboardEntry", userId: "me", displayName: "Ravi", streak: 2, totalCheckIns: 18, position: 214, isSelf: true },
          },
        },
        fetching: false,
        error: undefined,
        stale: false,
      },
      jest.fn(),
    ]);

    const { getByText, queryAllByText } = renderScreen();
    expect(getByText("You")).toBeTruthy();
    expect(getByText("214")).toBeTruthy();
    expect(queryAllByText(/July 2026 season/).length).toBeGreaterThan(0);
  });

  it("shows the empty state when there are no standings", () => {
    (gql.useLeaderboardQuery as jest.Mock).mockReturnValue([
      {
        data: {
          leaderboard: {
            __typename: "Leaderboard",
            segment: gql.LeaderboardSegment.Zone,
            scopeKey: "bandra",
            season: "2026-07",
            page: [],
            self: null,
          },
        },
        fetching: false,
        error: undefined,
        stale: false,
      },
      jest.fn(),
    ]);

    const { getByText } = renderScreen();
    expect(getByText("No standings yet")).toBeTruthy();
  });
});
