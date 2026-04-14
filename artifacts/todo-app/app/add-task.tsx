import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
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

export default function AddTaskScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Title required", "Please enter a task title.");
      return;
    }
    addTask(
      { title: title.trim(), description: description.trim(), dueDate },
      {
        onSuccess: () => {
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          Alert.alert("Task Added", `"${title.trim()}" has been added to your list.`, [
            { text: "Add Another", onPress: () => { setTitle(""); setDescription(""); setDueDate(null); } },
            { text: "View Tasks", onPress: () => router.replace("/tasks") },
            { text: "Main Menu", onPress: () => router.replace("/") },
          ]);
        }
      }
    );
  };

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Task</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.form,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>TITLE *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Buy groceries"
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
            returnKeyType="next"
            autoFocus
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
          <Feather name="check" size={18} color="#fff" />
          <Text style={styles.saveBtnText}>Save Task</Text>
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
          <Text style={[styles.cancelBtnText, { color: colors.secondaryForeground }]}>Cancel</Text>
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
  },
  backBtn: { padding: 6, marginRight: 8 },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    textAlign: "center",
  },
  form: {
    padding: 20,
    gap: 18,
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
