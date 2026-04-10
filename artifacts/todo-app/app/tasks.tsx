import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar, FilterType } from "@/components/FilterBar";
import { TaskCard } from "@/components/TaskCard";
import { Task, useTasks } from "@/context/TaskContext";
import { useColors } from "@/hooks/useColors";

export default function TasksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tasks, deleteTask, toggleStatus } = useTasks();
  const [filter, setFilter] = useState<FilterType>("all");
  const params = useLocalSearchParams();
  const mode = params.mode as string | undefined;

  const filtered = useMemo(() => {
    if (filter === "pending") return tasks.filter((t) => t.status === "pending");
    if (filter === "completed") return tasks.filter((t) => t.status === "completed");
    return tasks;
  }, [tasks, filter]);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks]
  );

  const handleDelete = (task: Task) => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: () => deleteTask(task.id),
        },
      ]
    );
  };

  const handlePress = (task: Task) => {
    if (mode === "delete") {
      handleDelete(task);
    } else {
      router.push(`/task/${task.id}`);
    }
  };

  const title = mode === "edit" ? "Edit Tasks" : mode === "delete" ? "Delete Tasks" : "All Tasks";
  const subtitle =
    mode === "edit"
      ? "Tap a task to edit it"
      : mode === "delete"
      ? "Tap a task to delete it"
      : "Manage your task list";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.primary,
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSub}>{subtitle}</Text>
        </View>
        <Pressable
          onPress={() => router.push("/add-task")}
          style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Feather name="plus" size={22} color="#fff" />
        </Pressable>
      </View>

      <FilterBar active={filter} onChange={setFilter} counts={counts} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => handlePress(item)}
            onToggle={() => toggleStatus(item.id)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={<EmptyState filter={filter} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20) },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 8,
  },
  backBtn: { padding: 6, marginTop: 2 },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  addBtn: { padding: 6, marginTop: 2 },
  list: { paddingTop: 4 },
});
