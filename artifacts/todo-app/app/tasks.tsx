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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOutUp, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
  const [searchQuery, setSearchQuery] = useState("");
  const params = useLocalSearchParams();
  const mode = params.mode as string | undefined;

  const filtered = useMemo(() => {
    let result = tasks;
    if (filter === "pending") result = result.filter((t) => t.status === "pending");
    else if (filter === "completed") result = result.filter((t) => t.status === "completed");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    return result;
  }, [tasks, filter, searchQuery]);

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
      ? "Choose a task to modify"
      : mode === "delete"
      ? "Choose a task to remove"
      : "Manage your daily list";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, "#818CF8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 32 : 16),
            paddingBottom: 24,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSub}>{subtitle}</Text>
          </View>
          <Pressable
            onPress={() => router.push("/add-task")}
            style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Feather name="plus-circle" size={24} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <FilterBar active={filter} onChange={setFilter} counts={counts} />

        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="search" size={20} color={colors.mutedForeground} style={styles.searchIcon} />
            <TextInput
              placeholder="Search tasks..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x-circle" size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 50).duration(400)}
              layout={Layout.springify()}
            >
              <TaskCard
                task={item}
                onPress={() => handlePress(item)}
                onToggle={() => toggleStatus(item.id)}
                onDelete={() => handleDelete(item)}
              />
            </Animated.View>
          )}
          ListEmptyComponent={<EmptyState filter={filter} />}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={filtered.length > 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginTop: -16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { marginRight: 12 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});

