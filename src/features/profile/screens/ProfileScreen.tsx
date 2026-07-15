import React from "react";
import { StyleSheet, View } from "react-native";
import {
  CreditCard,
  Receipt,
  ShieldWarning,
  Question,
  Gear,
} from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Avatar,
  TierBadge,
  Skeleton,
  StatePlaceholder,
  Divider,
  colors,
  spacing,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useViewerQuery } from "@/graphql/generated/graphql";
import { NavRow, RowDivider } from "../components/Rows";

/** Mock join date — no server field for it yet. */
const MEMBER_SINCE = "Jan 2025";

/**
 * Profile home. A calm identity header, two quiet stat tiles, then a plain list
 * of destinations. No orange lives here — Profile is a hub, not an action.
 */
export function ProfileScreen({ navigation }: MemberScreenProps<"Profile">) {
  const [{ data, fetching, error }] = useViewerQuery();
  const viewer = data?.viewer ?? null;

  return (
    <Screen scroll>
      {fetching && !viewer ? (
        <ProfileSkeleton />
      ) : error && !viewer ? (
        <View style={styles.errorBlock}>
          <StatePlaceholder
            variant="error"
            title="We could not load your profile"
            body="Check your connection and try again."
          />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Avatar uri={viewer?.avatarUrl} name={viewer?.name} size={64} />
            <View style={styles.headerText}>
              <Text preset="title" numberOfLines={1}>
                {viewer?.name ?? "Member"}
              </Text>
              <View style={styles.tierRow}>
                {viewer?.tier ? <TierBadge tier={viewer.tier} /> : null}
              </View>
            </View>
          </View>

          <View style={styles.stats}>
            <Card padded style={styles.statCard}>
              <Text preset="displayMedium">{viewer?.streak.current ?? 0}</Text>
              <Text preset="label" color="secondary" style={styles.statLabel}>
                DAY STREAK
              </Text>
            </Card>
            <Card padded style={styles.statCard}>
              <Text preset="bodyMedium" style={styles.since}>
                {MEMBER_SINCE}
              </Text>
              <Text preset="label" color="secondary" style={styles.statLabel}>
                MEMBER SINCE
              </Text>
            </Card>
          </View>

          <Card padded={false} style={styles.list}>
            <NavRow
              icon={CreditCard}
              label="Pass & payments"
              onPress={() => navigation.navigate("PassPayments")}
            />
            <Divider />
            <NavRow
              icon={Receipt}
              label="Invoices"
              onPress={() => navigation.navigate("Invoices")}
            />
            <Divider />
            <NavRow
              icon={ShieldWarning}
              label="SOS & trusted contact"
              onPress={() => navigation.navigate("SosContacts")}
            />
            <Divider />
            <NavRow
              icon={Question}
              label="Support"
              onPress={() => navigation.navigate("Support")}
            />
            <Divider />
            <NavRow
              icon={Gear}
              label="Settings"
              onPress={() => navigation.navigate("Settings")}
            />
          </Card>
        </>
      )}
    </Screen>
  );
}

function ProfileSkeleton() {
  return (
    <View>
      <View style={styles.header}>
        <Skeleton width={64} height={64} radius={32} />
        <View style={styles.headerText}>
          <Skeleton width={160} height={22} radius={6} />
          <Skeleton width={80} height={16} radius={6} style={{ marginTop: spacing.sm }} />
        </View>
      </View>
      <View style={styles.stats}>
        <Skeleton height={96} radius={16} style={styles.statCard} />
        <Skeleton height={96} radius={16} style={styles.statCard} />
      </View>
      <Skeleton height={280} radius={16} style={{ marginTop: spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  errorBlock: { height: 360 },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  headerText: { flex: 1 },
  tierRow: { marginTop: spacing.sm },
  stats: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xl },
  statCard: { flex: 1 },
  statLabel: { marginTop: spacing.sm },
  since: { paddingVertical: spacing.xs },
  list: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface.raised,
  },
});
