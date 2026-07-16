import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlass, UsersThree, CaretRight } from "phosphor-react-native";
import {
  Text,
  Card,
  Divider,
  Avatar,
  Skeleton,
  StatePlaceholder,
  PressableRow,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachTabScreenProps } from "@/app/navigation/types";
import { toUiError } from "@/lib/errors";
import { useCoachClientsQuery, type CoachClientRowFragment } from "@/graphql/generated/graphql";

export function CoachClientsScreen({ navigation }: CoachTabScreenProps<"CoachClients">) {
  const [query, setQuery] = useState("");
  const [{ data, fetching, error }, refetch] = useCoachClientsQuery();
  const uiError = toUiError(error);

  const clients = useMemo(() => {
    const all = data?.coachClients ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((c) => c.name.toLowerCase().includes(q));
  }, [query, data?.coachClients]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text preset="title">Clients</Text>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <MagnifyingGlass size={18} color={colors.text.secondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search clients"
            placeholderTextColor={colors.text.disabled}
            style={styles.searchInput}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
      </View>

      {fetching && !data ? (
        <View style={styles.content}>
          <Skeleton height={64} radius={radius.card} style={{ marginBottom: spacing.md }} />
          <Skeleton height={64} radius={radius.card} style={{ marginBottom: spacing.md }} />
          <Skeleton height={64} radius={radius.card} />
        </View>
      ) : uiError ? (
        <StatePlaceholder
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
          icon={<UsersThree size={40} color={colors.text.disabled} />}
          title="We could not load your clients"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      ) : clients.length === 0 ? (
        <StatePlaceholder
          variant="empty"
          icon={<UsersThree size={40} color={colors.text.disabled} />}
          title={query ? "No clients match that search" : "No clients yet"}
          body={
            query
              ? "Try a different name."
              : "Clients appear here after their first booking with you."
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Card padded={false}>
            {clients.map((c, i) => (
              <View key={c.id}>
                {i > 0 ? <Divider /> : null}
                <ClientRow
                  client={c}
                  onPress={() => navigation.navigate("CoachClientDetail", { clientId: c.id })}
                />
              </View>
            ))}
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function ClientRow({ client, onPress }: { client: CoachClientRowFragment; onPress: () => void }) {
  return (
    <PressableRow onPress={onPress} style={styles.clientRow}>
      <Avatar uri={client.avatarUrl ?? undefined} name={client.name} size={44} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text preset="bodyMedium">{client.name}</Text>
        <Text preset="body" color="secondary" numberOfLines={1}>
          {client.sessions} {client.sessions === 1 ? "session" : "sessions"}
        </Text>
      </View>
      <CaretRight size={18} color={colors.text.secondary} />
    </PressableRow>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchWrap: { paddingHorizontal: spacing.screen, paddingBottom: spacing.md },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text.primary,
    fontSize: 15,
  },
  content: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
  clientRow: { paddingHorizontal: spacing.lg },
});
