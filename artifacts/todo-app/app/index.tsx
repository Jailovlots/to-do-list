import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTasks } from "@/context/TaskContext";
import { useColors } from "@/hooks/useColors";

interface MenuItemProps {
  icon: string;
  label: string;
  subtitle: string;
  onPress: () => void;
  accent?: string;
  badge?: number;
}

function MenuItem({ icon, label, subtitle, onPress, accent, badge }: MenuItemProps) {
  const colors = useColors();
  const itemAccent = accent ?? colors.primary;

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.88 : 1,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: itemAccent + "18", borderRadius: 12 }]}>
        <Feather name={icon as any} size={22} color={itemAccent} />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{subtitle}</Text>
      </View>
      {badge !== undefined && badge > 0 && (
        <View style={[styles.badge, { backgroundColor: itemAccent }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function MainMenu() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tasks } = useTasks();

  const pending = tasks.filter((t) => t.status === "pending").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.primary,
            paddingTop: insets.top + (Platform.OS === "web" ? 32 : 16),
          },
        ]}
      >
        <Text style={styles.headerTitle}>My Tasks</Text>
        <Text style={styles.headerSub}>
          {pending} pending · {completed} done
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ACTIONS</Text>
        <MenuItem
          icon="plus-circle"
          label="Add Task"
          subtitle="Create a new task"
          onPress={() => router.push("/add-task")}
          accent={colors.primary}
        />
        <MenuItem
          icon="list"
          label="View Tasks"
          subtitle="Browse all your tasks"
          onPress={() => router.push("/tasks")}
          accent="#10b981"
          badge={pending}
        />
        <MenuItem
          icon="edit-3"
          label="Update Task"
          subtitle="Edit an existing task"
          onPress={() => router.push("/tasks?mode=edit")}
          accent="#f59e0b"
        />
        <MenuItem
          icon="trash-2"
          label="Delete Task"
          subtitle="Remove a task"
          onPress={() => router.push("/tasks?mode=delete")}
          accent="#ef4444"
        />

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground, marginTop: 24 }]}>
          STATS
        </Text>
        <View
          style={[
            styles.statsRow,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{tasks.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#f59e0b" }]}>{pending}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Pending</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#10b981" }]}>{completed}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Done</Text>
          </View>
        </View>

        <MenuItem
          icon="log-out"
          label="Exit App"
          subtitle="Close the application"
          onPress={() => router.push("/goodbye")}
          accent="#8b83b8"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  scroll: {
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 4,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1 },
  menuLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  menuSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  statsRow: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statDivider: {
    width: 1,
    marginVertical: 4,
  },
  statNumber: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
