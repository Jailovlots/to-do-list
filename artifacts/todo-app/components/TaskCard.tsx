import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Task } from "@/context/TaskContext";
import { useColors } from "@/hooks/useColors";

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(dateStr: string | null, status: string): boolean {
  if (!dateStr || status === "completed") return false;
  return new Date(dateStr) < new Date();
}

export function TaskCard({ task, onPress, onToggle, onDelete }: TaskCardProps) {
  const colors = useColors();
  const completed = task.status === "completed";
  const overdue = isOverdue(task.dueDate, task.status);
  const formattedDate = formatDate(task.dueDate);

  const handleToggle = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onToggle();
  };

  const handleDelete = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onDelete();
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: completed ? colors.border : colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.93 : 1,
          shadowColor: colors.shadow,
        },
        completed && { opacity: 0.7 },
      ]}
    >
      <TouchableOpacity
        onPress={handleToggle}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={[
          styles.checkbox,
          {
            borderColor: completed ? colors.primary : colors.border,
            backgroundColor: completed ? colors.primary : "transparent",
            borderRadius: 8,
          },
        ]}
        activeOpacity={0.7}
      >
        {completed && <Feather name="check" size={13} color={colors.primaryForeground} />}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.foreground },
            completed && { color: colors.mutedForeground, textDecorationLine: "line-through" },
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {!!task.description && (
          <Text
            style={[styles.description, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {task.description}
          </Text>
        )}
        {formattedDate && (
          <View style={styles.dateRow}>
            <Feather
              name="calendar"
              size={11}
              color={overdue ? colors.destructive : colors.mutedForeground}
            />
            <Text
              style={[
                styles.dateText,
                { color: overdue ? colors.destructive : colors.mutedForeground },
              ]}
            >
              {formattedDate}
              {overdue ? " · Overdue" : ""}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={handleDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.deleteBtn}
        activeOpacity={0.7}
      >
        <Feather name="trash-2" size={16} color={colors.destructive} />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  description: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
