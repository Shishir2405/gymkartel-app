import React, { useCallback, useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "phosphor-react-native";
import {
  Screen,
  Text,
  Button,
  StatePlaceholder,
  useToast,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { formatDate } from "@/lib/format";

interface ProgressPhoto {
  id: string;
  uri: string;
  takenAt: string;
}

export function ProgressPhotosScreen(_props: MemberScreenProps<"ProgressPhotos">) {
  const toast = useToast();
  const { width } = useWindowDimensions();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);

  const size = Math.floor((width - spacing.screen * 2 - spacing.md) / 2);

  const addPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;
    setPhotos((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        uri: asset.uri,
        takenAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    toast.show("Photo added");
  }, [toast]);

  if (photos.length === 0) {
    return (
      <Screen>
        <StatePlaceholder
          icon={<Camera size={40} color={colors.text.secondary} />}
          variant="empty"
          title="No photos yet"
          body="Add one now and again — the change shows up between the days you never noticed."
          actionLabel="Add photo"
          onAction={() => void addPhoto()}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll footer={<Button label="Add photo" onPress={() => void addPhoto()} />}>
      <Text preset="title">Progress photos</Text>
      <View style={styles.grid}>
        {photos.map((p) => (
          <View key={p.id} style={{ width: size }}>
            <Image
              source={{ uri: p.uri }}
              style={[styles.photo, { width: size, height: size }]}
            />
            <Text preset="label" color="secondary" style={styles.caption}>
              {formatDate(p.takenAt)}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  photo: {
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  caption: { marginTop: spacing.xs, letterSpacing: 0 },
});
