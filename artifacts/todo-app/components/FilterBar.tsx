import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useColors } from "@/hooks/useColors";

export type FilterType = "all" | "pending" | "completed";

interface FilterBarProps {
  active: FilterType;
  onChange: (f: FilterType) => void;
  counts: { all: number; pending: number; completed: number };
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Done" },
];

export function FilterBar({ active, onChange, counts }: FilterBarProps) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((f) => {
        const isActive = f.key === active;
        return (
          <Pressable
            key={f.key}
            onPress={() => onChange(f.key)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.secondary,
                borderRadius: 20,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? colors.primaryForeground : colors.secondaryForeground,
                  fontFamily: isActive ? "Inter_600SemiBold" : "Inter_500Medium",
                },
              ]}
            >
              {f.label}
            </Text>
            <Text
              style={[
                styles.count,
                {
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.25)"
                    : colors.muted,
                  color: isActive ? colors.primaryForeground : colors.mutedForeground,
                },
              ]}
            >
              {counts[f.key]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
  },
  label: {
    fontSize: 13,
  },
  count: {
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    fontFamily: "Inter_600SemiBold",
    overflow: "hidden",
  },
});
