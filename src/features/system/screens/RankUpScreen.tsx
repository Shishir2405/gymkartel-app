import React from "react";
import { StyleSheet, View } from "react-native";
import { RankUpTakeover, colors } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";

/**
 * Full-screen host for the rank-up cinematic. It owns nothing but the params and
 * the dismissal — the takeover itself carries all the motion and the single
 * action. Continue returns to wherever the rank-up was triggered.
 */
export function RankUpScreen({ route, navigation }: MemberScreenProps<"RankUp">) {
  const { fromRank, toRank, isTopRank } = route.params;
  return (
    <View style={styles.wrap} testID="rank-up">
      <RankUpTakeover
        fromRank={fromRank}
        toRank={toRank}
        isTopRank={isTopRank ?? false}
        onDone={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg.base },
});
