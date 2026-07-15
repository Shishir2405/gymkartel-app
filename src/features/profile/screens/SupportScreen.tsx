import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { CaretDown, CaretRight, WarningOctagon, ChatCircle } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Sheet,
  Divider,
  PressableRow,
  useToast,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";

interface Faq {
  id: string;
  question: string;
  answer: string;
}

const FAQS: Faq[] = [
  {
    id: "pass",
    question: "How do rolled-over days work?",
    answer:
      "Unused days on an active pass are held for you and applied to your next pass when you renew. You never lose days you have paid for.",
  },
  {
    id: "checkin",
    question: "What if a gym scanner will not read my pass?",
    answer:
      "Ask the front desk to enter your member code manually. Your check-in and streak are recorded either way.",
  },
  {
    id: "coach",
    question: "Can I cancel a coach session?",
    answer:
      "You can cancel up to the cutoff shown on the booking. After the cutoff the session is charged to support the coach's held time.",
  },
];

/**
 * Support. The safety-incident report sits at the very top as a destructive
 * entry that opens a plain, serious confirm. Below it are quiet FAQ rows and a
 * single contact action. Nothing here competes with the incident path.
 */
export function SupportScreen(_props: MemberScreenProps<"Support">) {
  const toast = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <Screen scroll>
      <Text preset="title" style={styles.heading}>
        Support
      </Text>

      <Card padded style={styles.reportCard}>
        <PressableRow onPress={() => setReportOpen(true)} style={styles.reportRow}>
          <WarningOctagon size={22} color={colors.accent.primary} />
          <View style={styles.reportBody}>
            <Text preset="bodyMedium" style={{ color: colors.accent.primary }}>
              Report a safety incident
            </Text>
            <Text preset="body" color="secondary" style={styles.reportSub}>
              Something happened during a session or at a gym.
            </Text>
          </View>
        </PressableRow>
      </Card>

      <Text preset="label" color="secondary" style={styles.faqLabel}>
        HELP TOPICS
      </Text>
      <Card padded={false} style={styles.list}>
        {FAQS.map((faq, i) => {
          const open = expanded === faq.id;
          return (
            <View key={faq.id}>
              {i > 0 ? <Divider /> : null}
              <Pressable
                onPress={() => setExpanded(open ? null : faq.id)}
                style={({ pressed }) => [styles.faqRow, pressed && { opacity: 0.7 }]}
              >
                <Text preset="bodyMedium" style={styles.faqQuestion}>
                  {faq.question}
                </Text>
                {open ? (
                  <CaretDown size={18} color={colors.text.disabled} />
                ) : (
                  <CaretRight size={18} color={colors.text.disabled} />
                )}
              </Pressable>
              {open ? (
                <Text preset="body" color="secondary" style={styles.faqAnswer}>
                  {faq.answer}
                </Text>
              ) : null}
            </View>
          );
        })}
      </Card>

      <Card padded style={styles.contactCard}>
        <PressableRow
          onPress={() => toast.show("Support chat opening")}
          style={styles.reportRow}
        >
          <ChatCircle size={22} color={colors.text.secondary} />
          <View style={styles.reportBody}>
            <Text preset="bodyMedium">Contact support</Text>
            <Text preset="body" color="secondary" style={styles.reportSub}>
              We reply within a day, usually much sooner.
            </Text>
          </View>
          <CaretRight size={18} color={colors.text.disabled} />
        </PressableRow>
      </Card>

      <Sheet
        visible={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report a safety incident"
        serious
      >
        <Text preset="body" style={styles.sheetBody}>
          We review every report. Nothing is shared with the other party without
          your say. If you are in immediate danger, use the SOS shield to call
          emergency services first.
        </Text>
        <View style={styles.sheetActions}>
          <Pressable
            onPress={() => {
              setReportOpen(false);
              toast.show("Report started");
            }}
            style={({ pressed }) => [styles.seriousPrimary, pressed && { opacity: 0.85 }]}
          >
            <Text preset="bodyMedium" style={{ color: colors.serious.surface }}>
              Continue to report
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setReportOpen(false)}
            style={({ pressed }) => [styles.seriousGhost, pressed && { opacity: 0.7 }]}
          >
            <Text preset="bodyMedium" style={{ color: colors.serious.text }}>
              Not now
            </Text>
          </Pressable>
        </View>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.lg },
  reportCard: { marginBottom: spacing.lg },
  reportRow: { alignItems: "center", gap: spacing.md, paddingVertical: 0 },
  reportBody: { flex: 1 },
  reportSub: { marginTop: 2 },
  faqLabel: { marginBottom: spacing.sm },
  list: {
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface.raised,
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  faqQuestion: { flex: 1 },
  faqAnswer: { paddingBottom: spacing.md },
  contactCard: { marginTop: spacing.lg },
  sheetBody: { color: colors.serious.text, lineHeight: 22 },
  sheetActions: { marginTop: spacing.xl, gap: spacing.sm },
  seriousPrimary: {
    height: 52,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.serious.text,
  },
  seriousGhost: {
    height: 52,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
});
