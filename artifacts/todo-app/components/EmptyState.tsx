import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface EmptyStateProps {
  filter: string;
}

export function EmptyState({ filter }: EmptyStateProps) {
  const colors = useColors();
  const message =
    filter === "completed"
      ? "No completed tasks yet"
      : filter === "pending"
      ? "All tasks completed!"
      : "No tasks yet. Add one to get started.";

  const icon: any =
    filter === "completed" ? "check-circle" : filter === "pending" ? "star" : "inbox";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: colors.secondary, borderRadius: colors.radius * 2 },
        ]}
      >
        <Feather name={icon} size={36} color={colors.primary} />
      </View>
      <Text style={[styles.message, { color: colors.mutedForeground }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 16,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
});
