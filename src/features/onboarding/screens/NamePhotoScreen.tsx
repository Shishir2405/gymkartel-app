import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "phosphor-react-native";
import { Text, Button, Screen, Avatar, useToast, colors, spacing } from "@/ui";
import type { AuthScreenProps } from "@/app/navigation/types";
import { useOnboardingStore } from "@/store/onboardingStore";
import { haptics } from "@/lib/haptics";
import { Field } from "../components/Field";

/**
 * Name and face. The photo is optional but encouraged — a real member card
 * wants a real face. The avatar tile is the tap target; the primary button
 * stays the only orange element and is disabled until a name is entered.
 */
export function NamePhotoScreen({ navigation }: AuthScreenProps<"NamePhoto">) {
  const storedName = useOnboardingStore((s) => s.name);
  const avatarUri = useOnboardingStore((s) => s.avatarUri);
  const setOnboarding = useOnboardingStore((s) => s.set);
  const toast = useToast();

  const [name, setName] = useState(storedName);
  const [picking, setPicking] = useState(false);

  const pickPhoto = async () => {
    if (picking) return;
    setPicking(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.show("Photo access is off. You can add one later.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) return;
      setOnboarding({ avatarUri: asset.uri });
      void haptics.success();
    } finally {
      setPicking(false);
    }
  };

  const onContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setOnboarding({ name: trimmed });
    navigation.navigate("HealthQuiz");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen
        testID="name-photo"
        footer={
          <Button
            testID="name-photo.continue"
            label="Continue"
            onPress={onContinue}
            disabled={name.trim().length === 0}
          />
        }
      >
        <View style={styles.header}>
          <Text preset="title">Who are you</Text>
          <Text preset="body" color="secondary" style={styles.sub}>
            This is the name and face on your member card.
          </Text>
        </View>

        <View style={styles.avatarWrap}>
          <Pressable
            testID="name-photo.photo"
            onPress={pickPhoto}
            accessibilityRole="button"
            accessibilityLabel="Add a photo"
            style={styles.avatarTap}
          >
            <Avatar uri={avatarUri} name={name} size={112} />
            <View style={styles.badge}>
              <Camera size={16} weight="regular" color={colors.text.secondary} />
            </View>
          </Pressable>
          <Text preset="label" color="secondary" style={styles.avatarHint}>
            {picking ? "Opening library" : avatarUri ? "Change photo" : "Add a photo"}
          </Text>
        </View>

        <Field
          testID="name-photo.name-input"
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
          maxLength={80}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg.base },
  header: { marginBottom: spacing.xl },
  sub: { marginTop: spacing.sm },
  avatarWrap: { alignItems: "center", marginBottom: spacing.xxl },
  avatarTap: { alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.raised,
    borderWidth: 3,
    borderColor: colors.bg.base,
  },
  avatarHint: { marginTop: spacing.md },
});
