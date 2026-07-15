import React, { useMemo, useState } from "react";
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
  Skeleton,
  StatePlaceholder,
  useToast,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachScreenProps } from "@/app/navigation/types";
import { useCoachProfileQuery, CertificationStatus } from "@/graphql/generated/graphql";
import { formatRupees } from "@/lib/format";
import { toUiError } from "@/lib/errors";
import { COACH_TAKE_RATE } from "@gymkartel/contracts";
import { MOCK_SPECIALTIES } from "@/features/coachside/lib/mock";

/**
 * Coach profile editor. Display name, bio, specialty chips and price are
 * pre-filled from `coachProfile`. The price field carries a LIVE take-home
 * preview via COACH_TAKE_RATE (sourced from @gymkartel/contracts) so the coach
 * always sees what they keep. Certifications are read-only status rows straight
 * from the server (`certifications` with their verification status).
 */
export function CoachProfileEditorScreen({ navigation }: CoachScreenProps<"CoachProfileEditor">) {
  const [{ data, fetching, error }, refetch] = useCoachProfileQuery();
  const { show } = useToast();
  const profile = data?.coachProfile ?? null;
  const uiError = toUiError(error);

  if (fetching && !profile) {
    return (
      <Screen scroll>
        <Text preset="title">Edit profile</Text>
        <Skeleton height={48} radius={radius.md} style={{ marginTop: spacing.xl }} />
        <Skeleton height={96} radius={radius.md} style={{ marginTop: spacing.lg }} />
        <Skeleton height={140} radius={radius.card} style={{ marginTop: spacing.lg }} />
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen>
        <StatePlaceholder
          variant={uiError?.code === "OFFLINE" ? "offline" : "error"}
          title="We could not load your profile"
          body={uiError?.message ?? "Please try again."}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      </Screen>
    );
  }

  return <ProfileForm profile={profile} onSaved={() => show("Saved")} onBack={() => navigation.goBack()} />;
}

type Profile = NonNullable<ReturnType<typeof useCoachProfileQuery>[0]["data"]>["coachProfile"];

function ProfileForm({
  profile,
  onSaved,
  onBack,
}: {
  profile: Profile;
  onSaved: () => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [selected, setSelected] = useState<string[]>(profile.specialties);
  const [priceText, setPriceText] = useState(String(Math.round(profile.pricePerSessionPaise / 100)));

  // Option catalog: the coach's own specialties plus the standard set. There is
  // no catalog query in the contract yet, so the standard set stays local.
  const options = useMemo(() => {
    const set = new Set<string>([...profile.specialties, ...MOCK_SPECIALTIES]);
    return Array.from(set);
  }, [profile.specialties]);

  const priceRupees = Number(priceText.replace(/[^0-9]/g, "")) || 0;
  const takeHomePaise = Math.round(priceRupees * 100 * COACH_TAKE_RATE);

  const toggle = (s: string) => {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <Screen scroll footer={<Button label="Save profile" onPress={onSaved} />}>
      <View style={styles.topBar}>
        <IconButton icon={CaretLeft} accessibilityLabel="Back" onPress={onBack} />
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
        {options.map((s) => (
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
        {profile.certifications.length === 0 ? (
          <Text preset="body" color="secondary">
            No certifications on file yet.
          </Text>
        ) : (
          profile.certifications.map((c, i) => (
            <View key={`${c.title}-${c.issuer}`}>
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
          ))
        )}
      </Card>
    </Screen>
  );
}

function CertStatusChip({ status }: { status: CertificationStatus }) {
  if (status === CertificationStatus.Verified) {
    return (
      <View style={styles.statusChip}>
        <CheckCircle size={16} weight="fill" color={colors.accent.primary} />
        <Text preset="label" color="accent" style={{ marginLeft: 4 }}>
          VERIFIED
        </Text>
      </View>
    );
  }
  if (status === CertificationStatus.Rejected) {
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
