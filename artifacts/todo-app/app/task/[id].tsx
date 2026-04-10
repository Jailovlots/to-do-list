import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DatePickerField } from "@/components/DatePickerField";
import { useTasks } from "@/context/TaskContext";
import { useColors } from "@/hooks/useColors";

export default function EditTaskScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTask, updateTask, deleteTask, toggleStatus } = useTasks();

  const task = getTask(id);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState<string | null>(task?.dueDate ?? null);

  useEffect(() => {
    if (!task) {
      router.replace("/tasks");
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Title required", "Please enter a task title.");
      return;
    }
    updateTask(id, {
      title: title.trim(),
      description: description.trim(),
      dueDate,
    });
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert("Changes Saved", `"${title.trim()}" has been updated.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: () => {
            deleteTask(id);
            router.replace("/tasks");
          },
        },
      ]
    );
  };

  const handleToggle = () => {
    toggleStatus(id);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const completed = task.status === "completed";

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
        <Text style={styles.headerTitle}>Edit Task</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Feather name="trash-2" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.form,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={handleToggle}
          style={({ pressed }) => [
            styles.statusToggle,
            {
              backgroundColor: completed ? "#10b981" + "18" : colors.secondary,
              borderColor: completed ? "#10b981" : colors.border,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather
            name={completed ? "check-circle" : "circle"}
            size={18}
            color={completed ? "#10b981" : colors.mutedForeground}
          />
          <Text
            style={[
              styles.statusText,
              { color: completed ? "#10b981" : colors.mutedForeground },
            ]}
          >
            {completed ? "Completed — tap to mark pending" : "Pending — tap to mark complete"}
          </Text>
        </Pressable>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>TITLE *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
                borderRadius: colors.radius,
                color: colors.foreground,
              },
            ]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>DESCRIPTION</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Optional details..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            style={[
              styles.textarea,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
                borderRadius: colors.radius,
                color: colors.foreground,
              },
            ]}
            textAlignVertical="top"
          />
        </View>

        <DatePickerField value={dueDate} onChange={setDueDate} label="DUE DATE" />

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="save" size={18} color="#fff" />
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.cancelBtn,
            {
              backgroundColor: colors.secondary,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.cancelBtnText, { color: colors.secondaryForeground }]}>
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 8,
  },
  backBtn: { padding: 6 },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    textAlign: "center",
  },
  deleteBtn: { padding: 6 },
  form: {
    padding: 20,
    gap: 18,
  },
  statusToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderWidth: 1.5,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  fieldGroup: { gap: 6 },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    borderWidth: 1.5,
  },
  textarea: {
    height: 100,
    paddingHorizontal: 14,
    paddingTop: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    borderWidth: 1.5,
  },
  saveBtn: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  cancelBtn: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
