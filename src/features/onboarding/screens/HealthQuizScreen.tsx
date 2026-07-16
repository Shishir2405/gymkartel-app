import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Text, Button, Screen, Chip, colors, spacing } from "@/ui";
import type { AuthScreenProps } from "@/app/navigation/types";
import {
  useOnboardingStore,
  type HealthGoal,
  type Experience,
} from "@/store/onboardingStore";
import { haptics } from "@/lib/haptics";
import { Field } from "../components/Field";
import { StepDots } from "../components/StepDots";

const GOALS: { value: HealthGoal; label: string }[] = [
  { value: "STRENGTH", label: "Build strength" },
  { value: "FAT_LOSS", label: "Lose fat" },
  { value: "ENDURANCE", label: "Build endurance" },
  { value: "GENERAL", label: "Stay in shape" },
];

const EXPERIENCE: { value: Experience; label: string }[] = [
  { value: "NEW", label: "New to training" },
  { value: "RETURNING", label: "Getting back into it" },
  { value: "REGULAR", label: "Train regularly" },
];

const DAYS = [1, 2, 3, 4, 5, 6, 7];
const TOTAL_STEPS = 4;

export function HealthQuizScreen({ navigation }: AuthScreenProps<"HealthQuiz">) {
  const goal = useOnboardingStore((s) => s.goal);
  const experience = useOnboardingStore((s) => s.experience);
  const trainingDaysTarget = useOnboardingStore((s) => s.trainingDaysTarget);
  const injuriesNote = useOnboardingStore((s) => s.injuriesNote);
  const set = useOnboardingStore((s) => s.set);

  const [step, setStep] = useState(0);

  const canAdvance =
    step === 0
      ? goal !== null
      : step === 1
        ? experience !== null
        : true;

  const isLast = step === TOTAL_STEPS - 1;

  const onPrimary = () => {
    if (!canAdvance) return;
    if (isLast) {
      navigation.navigate("PickTier");
      return;
    }
    void haptics.light();
    setStep((s) => s + 1);
  };

  const onBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }
    setStep((s) => s - 1);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen
        testID="health-quiz"
        footer={
          <Button
            testID="health-quiz.primary"
            label={isLast ? "Continue" : "Next"}
            onPress={onPrimary}
            disabled={!canAdvance}
          />
        }
      >
        <View style={styles.top}>
          <StepDots total={TOTAL_STEPS} index={step} />
          <Button label="Back" variant="ghost" onPress={onBack} fullWidth={false} />
        </View>

        {step === 0 ? (
          <QuestionCard
            title="What are you here for"
            body="Pick the one that fits best. You can change it later."
          >
            <View style={styles.chips}>
              {GOALS.map((g) => (
                <Chip
                  key={g.value}
                  testID={`health-quiz.goal.${g.value}`}
                  label={g.label}
                  selected={goal === g.value}
                  onPress={() => set({ goal: g.value })}
                />
              ))}
            </View>
          </QuestionCard>
        ) : null}

        {step === 1 ? (
          <QuestionCard
            title="Where are you starting"
            body="This sets the pace of what we suggest."
          >
            <View style={styles.chips}>
              {EXPERIENCE.map((e) => (
                <Chip
                  key={e.value}
                  testID={`health-quiz.experience.${e.value}`}
                  label={e.label}
                  selected={experience === e.value}
                  onPress={() => set({ experience: e.value })}
                />
              ))}
            </View>
          </QuestionCard>
        ) : null}

        {step === 2 ? (
          <QuestionCard
            title="Days a week you want to train"
            body="A target, not a rule. Aim for what you can keep."
          >
            <View style={styles.chips}>
              {DAYS.map((d) => (
                <Chip
                  key={d}
                  testID={`health-quiz.days.${d}`}
                  label={String(d)}
                  selected={trainingDaysTarget === d}
                  onPress={() => set({ trainingDaysTarget: d })}
                />
              ))}
            </View>
          </QuestionCard>
        ) : null}

        {step === 3 ? (
          <QuestionCard
            title="Any injuries to note"
            body="Optional. It helps coaches keep sessions safe for you."
          >
            <Field
              testID="health-quiz.injuries-input"
              label="Injuries or limits"
              value={injuriesNote}
              onChangeText={(next) => set({ injuriesNote: next.slice(0, 280) })}
              placeholder="e.g. recovering knee, avoid heavy squats"
              multiline
              maxLength={280}
              hint={`${injuriesNote.length}/280`}
            />
          </QuestionCard>
        ) : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}

function QuestionCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text preset="title">{title}</Text>
      <Text preset="body" color="secondary" style={styles.body}>
        {body}
      </Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg.base },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xxl,
  },
  body: { marginTop: spacing.sm },
  content: { marginTop: spacing.xl },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
