import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { CaretLeft, CheckCircle } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Chip,
  Divider,
  Button,
  IconButton,
  useToast,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachScreenProps } from "@/app/navigation/types";
import { useViewerQuery } from "@/graphql/generated/graphql";
import { formatRupees } from "@/lib/format";
import { COACH_TAKE_RATE } from "@gymkartel/contracts";
import { MOCK_SPECIALTIES, MOCK_CERTS, type CertStatus } from "@/features/coachside/lib/mock";

/**
 * Coach profile editor. Display name, bio, specialty chips and price. The price
 * field carries a LIVE take-home preview via COACH_TAKE_RATE so the coach always
 * sees what they keep. Certifications are read-only status rows.
 */
export function CoachProfileEditorScreen({ navigation }: CoachScreenProps<"CoachProfileEditor">) {
  const [{ data }] = useViewerQuery();
  const { show } = useToast();

  const [name, setName] = useState(data?.viewer?.name ?? "");
  const [bio, setBio] = useState(
    "Strength and conditioning coach. I build plans you can hold to, and I hold you to them.",
  );
  const [selected, setSelected] = useState<string[]>(["Strength", "Mobility"]);
  const [priceText, setPriceText] = useState("1299");

  const priceRupees = Number(priceText.replace(/[^0-9]/g, "")) || 0;
  const takeHomePaise = Math.round(priceRupees * 100 * COACH_TAKE_RATE);

  const toggle = (s: string) => {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <Screen
      scroll
      footer={<Button label="Save profile" onPress={() => show("Saved")} />}
    >
      <View style={styles.topBar}>
        <IconButton icon={CaretLeft} accessibilityLabel="Back" onPress={() => navigation.goBack()} />
      </View>

      <Text preset="title">Edit profile</Text>

      {/* Display name */}
      <Text preset="label" color="secondary" style={styles.section}>
        DISPLAY NAME
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name as clients see it"
        placeholderTextColor={colors.text.disabled}
        style={styles.input}
      />

      {/* Bio */}
      <Text preset="label" color="secondary" style={styles.section}>
        BIO
      </Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="A few lines on how you coach"
        placeholderTextColor={colors.text.disabled}
        style={[styles.input, styles.multiline]}
        multiline
      />

      {/* Specialties */}
      <Text preset="label" color="secondary" style={styles.section}>
        SPECIALTIES
      </Text>
      <View style={styles.chips}>
        {MOCK_SPECIALTIES.map((s) => (
          <Chip key={s} label={s} selected={selected.includes(s)} onPress={() => toggle(s)} />
        ))}
      </View>

      {/* Price with live take-home preview */}
      <Text preset="label" color="secondary" style={styles.section}>
        PRICE PER SESSION
      </Text>
      <View style={styles.priceRow}>
        <Text preset="title" color="secondary" style={{ marginRight: spacing.sm }}>
          ₹
        </Text>
        <TextInput
          value={priceText}
          onChangeText={setPriceText}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.text.disabled}
          style={[styles.input, { flex: 1 }]}
        />
      </View>
      <Card padded style={{ marginTop: spacing.md }}>
        <Text preset="body" color="secondary">
          You keep {formatRupees(takeHomePaise)} (80%)
        </Text>
        <Text preset="body" color="secondary" style={{ marginTop: 4 }}>
          The platform keeps 20 percent. Take-home updates as you change the price.
        </Text>
      </Card>

      {/* Certifications */}
      <Text preset="label" color="secondary" style={styles.section}>
        CERTIFICATIONS
      </Text>
      <Card padded>
        {MOCK_CERTS.map((c, i) => (
          <View key={c.id}>
            {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
            <View style={styles.certRow}>
              <View style={{ flex: 1 }}>
                <Text preset="bodyMedium">{c.title}</Text>
                <Text preset="body" color="secondary">
                  {c.issuer}
                </Text>
              </View>
              <CertStatusChip status={c.status} />
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

function CertStatusChip({ status }: { status: CertStatus }) {
  if (status === "VERIFIED") {
    return (
      <View style={styles.statusChip}>
        <CheckCircle size={16} weight="fill" color={colors.accent.primary} />
        <Text preset="label" color="accent" style={{ marginLeft: 4 }}>
          VERIFIED
        </Text>
      </View>
    );
  }
  if (status === "REJECTED") {
    return (
      <Text preset="label" style={{ color: colors.serious.danger }}>
        REJECTED
      </Text>
    );
  }
  return (
    <Text preset="label" color="disabled">
      PENDING
    </Text>
  );
}

const styles = StyleSheet.create({
  topBar: { marginLeft: -spacing.md, marginBottom: spacing.sm },
  section: { marginTop: spacing.xl, marginBottom: spacing.sm },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.pressed,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
  multiline: { minHeight: 96, textAlignVertical: "top" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  priceRow: { flexDirection: "row", alignItems: "center" },
  certRow: { flexDirection: "row", alignItems: "center" },
  statusChip: { flexDirection: "row", alignItems: "center" },
});
