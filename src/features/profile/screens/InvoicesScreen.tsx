import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Receipt } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Button,
  Skeleton,
  StatePlaceholder,
  Divider,
  colors,
  spacing,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { passPrice, type Tier, type PassPack } from "@gymkartel/contracts";
import { formatRupees, formatDate } from "@/lib/format";

interface Invoice {
  id: string;
  isoDate: string;
  packDays: number;
  tier: Tier;
  pack: PassPack;
}

const MOCK_INVOICES: Invoice[] = [
  { id: "inv-2026-06", isoDate: "2026-06-14T09:00:00.000Z", packDays: 15, tier: "STANDARD", pack: "FIFTEEN_DAY" },
  { id: "inv-2026-05", isoDate: "2026-05-02T09:00:00.000Z", packDays: 30, tier: "PREMIUM", pack: "THIRTY_DAY" },
  { id: "inv-2026-04", isoDate: "2026-04-11T09:00:00.000Z", packDays: 7, tier: "BASIC", pack: "SEVEN_DAY" },
];

export function InvoicesScreen(_props: MemberScreenProps<"Invoices">) {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInvoices(MOCK_INVOICES);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Screen scroll>
      <Text preset="title" style={styles.heading}>
        Invoices
      </Text>

      {loading ? (
        <View style={styles.skeletons}>
          <Skeleton height={72} radius={16} />
          <Skeleton height={72} radius={16} />
          <Skeleton height={72} radius={16} />
        </View>
      ) : invoices.length === 0 ? (
        <View style={styles.emptyBlock}>
          <StatePlaceholder
            variant="empty"
            icon={<Receipt size={40} color={colors.text.secondary} />}
            title="No invoices yet"
            body="Your pass and session receipts will appear here."
          />
        </View>
      ) : (
        <Card padded={false} style={styles.list}>
          {invoices.map((inv, i) => (
            <View key={inv.id}>
              {i > 0 ? <Divider /> : null}
              <View style={styles.row}>
                <View style={styles.rowBody}>
                  <Text preset="bodyMedium">
                    {inv.packDays}-day {inv.tier} pass
                  </Text>
                  <Text preset="body" color="secondary" style={styles.rowSub}>
                    {formatDate(inv.isoDate)} · {formatRupees(passPrice(inv.tier, inv.pack))}
                  </Text>
                </View>
                <Button
                  label="Download"
                  variant="ghost"
                  fullWidth={false}
                  onPress={() => {
                  }}
                />
              </View>
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.lg },
  skeletons: { gap: spacing.md },
  emptyBlock: { height: 360 },
  list: {
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface.raised,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowBody: { flex: 1 },
  rowSub: { marginTop: 2 },
});
