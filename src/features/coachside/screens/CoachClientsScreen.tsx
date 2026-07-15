import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlass, UsersThree, CaretRight } from "phosphor-react-native";
import {
  Text,
  Card,
  Divider,
  Avatar,
  StatePlaceholder,
  PressableRow,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachTabScreenProps } from "@/app/navigation/types";
import { formatDate } from "@/lib/format";
import { MOCK_CLIENTS, type CoachClient } from "@/features/coachside/lib/mock";

/**
 * The coach's client roster. A search field filters by name, each row opens the
 * client detail. Empty state covers both "no clients yet" and "no search match".
 */
export function CoachClientsScreen({ navigation }: CoachTabScreenProps<"CoachClients">) {
  const [query, setQuery] = useState("");

  const clients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_CLIENTS;
    return MOCK_CLIENTS.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

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

      {clients.length === 0 ? (
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

function ClientRow({ client, onPress }: { client: CoachClient; onPress: () => void }) {
  return (
    <PressableRow onPress={onPress} style={styles.clientRow}>
      <Avatar name={client.name} size={44} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text preset="bodyMedium">{client.name}</Text>
        <Text preset="body" color="secondary" numberOfLines={1}>
          {client.goal} · {client.sessionsCompleted} sessions
        </Text>
        {client.nextSessionIso ? (
          <Text preset="label" color="secondary" style={{ marginTop: 2 }}>
            NEXT {formatDate(client.nextSessionIso).toUpperCase()}
          </Text>
        ) : null}
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
