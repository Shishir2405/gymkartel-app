import React from "react";
import { Share, StyleSheet, View } from "react-native";
import {
  Screen,
  Text,
  Card,
  Button,
  Divider,
  useToast,
  spacing,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { REFERRAL_CODE } from "@/features/club/data/mock";

export function RecruitScreen(_props: MemberScreenProps<"Recruit">) {
  const toast = useToast();

  const onCopy = () => {
    toast.show("Code copied");
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Join me on Gym Kartel. Use my code ${REFERRAL_CODE} when you get your first pass and we both get a bonus day.`,
      });
    } catch {
      toast.show("Could not open share");
    }
  };

  return (
    <Screen
      scroll
      testID="recruit"
      footer={<Button label="Share invite" onPress={onShare} />}
    >
      <Text preset="title" style={styles.heading}>
        Recruit
      </Text>
      <Text preset="body" color="secondary" style={styles.subhead}>
        Share your code with someone who trains. When they get their first pass,
        you both earn a bonus day.
      </Text>

      <Card padded style={styles.codeCard}>
        <Text preset="label" color="secondary">
          YOUR CODE
        </Text>
        <Text preset="displayMedium" style={styles.code}>
          {REFERRAL_CODE}
        </Text>
        <Divider style={styles.codeDivider} />
        <Button
          label="Copy code"
          variant="secondary"
          fullWidth
          onPress={onCopy}
        />
      </Card>

      <Card padded style={styles.rewardCard}>
        <Text preset="label" color="secondary">
          THE REWARD
        </Text>
        <View style={styles.rewardRow}>
          <Text preset="bodyMedium" style={styles.rewardStep}>
            1.
          </Text>
          <Text preset="body" color="secondary" style={styles.rewardText}>
            Send your code to someone new to Gym Kartel.
          </Text>
        </View>
        <View style={styles.rewardRow}>
          <Text preset="bodyMedium" style={styles.rewardStep}>
            2.
          </Text>
          <Text preset="body" color="secondary" style={styles.rewardText}>
            They enter it when they get their first pass.
          </Text>
        </View>
        <View style={styles.rewardRow}>
          <Text preset="bodyMedium" style={styles.rewardStep}>
            3.
          </Text>
          <Text preset="body" color="secondary" style={styles.rewardText}>
            You both get one bonus day added to your pass.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.sm },
  subhead: { marginBottom: spacing.lg },
  codeCard: {},
  code: { marginTop: spacing.xs },
  codeDivider: { marginVertical: spacing.lg },
  rewardCard: { marginTop: spacing.lg },
  rewardRow: { flexDirection: "row", marginTop: spacing.md },
  rewardStep: { width: 24 },
  rewardText: { flex: 1 },
});
