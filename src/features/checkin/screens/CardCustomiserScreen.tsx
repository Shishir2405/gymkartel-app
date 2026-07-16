import React, { useRef, useState } from "react";
import { Share, StyleSheet, View, ScrollView } from "react-native";
import { captureRef } from "react-native-view-shot";
import { Screen, Text, Button, Chip, spacing } from "../../../ui";
import { ShareCard, type ShareTemplate } from "../components/ShareCard";
import type { MemberScreenProps } from "../../../app/navigation/types";

const TEMPLATES: { key: ShareTemplate; label: string }[] = [
  { key: "classic", label: "Classic" },
  { key: "mono", label: "Mono" },
  { key: "bold", label: "Bold" },
];

export function CardCustomiserScreen({ route }: MemberScreenProps<"CardCustomiser">) {
  const { gymName, dayNumber, streak, rank, date } = route.params;
  const [template, setTemplate] = useState<ShareTemplate>("classic");
  const cardRef = useRef<View>(null);

  const onShare = async () => {
    try {
      const uri = await captureRef(cardRef, { format: "png", quality: 1, width: 1080, height: 1920 });
      await Share.share({ url: uri, message: `Day ${dayNumber} at ${gymName}.` });
    } catch {
    }
  };

  return (
    <Screen footer={<Button label="Share" onPress={onShare} />}>
      <Text preset="title" style={{ marginBottom: spacing.lg }}>
        Choose a card
      </Text>

      <View style={styles.chips}>
        {TEMPLATES.map((t) => (
          <Chip
            key={t.key}
            label={t.label}
            selected={template === t.key}
            onPress={() => setTemplate(t.key)}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.preview} showsVerticalScrollIndicator={false}>
        <View collapsable={false} ref={cardRef}>
          <ShareCard
            template={template}
            gymName={gymName}
            dayNumber={dayNumber}
            streak={streak}
            rank={rank}
            date={date}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xl },
  preview: { alignItems: "center", paddingBottom: spacing.xl },
});
