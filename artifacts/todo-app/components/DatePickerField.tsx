import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface DatePickerFieldProps {
  value: string | null;
  onChange: (date: string | null) => void;
  label: string;
}

function formatDisplay(dateStr: string | null): string {
  if (!dateStr) return "No due date";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "No due date";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DatePickerField({ value, onChange, label }: DatePickerFieldProps) {
  const colors = useColors();
  const [showPicker, setShowPicker] = useState(false);
  const dateValue = value ? new Date(value) : new Date();

  const handleChange = (_: any, selected?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selected) {
      onChange(selected.toISOString().split("T")[0]);
    }
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
        <input
          type="date"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          style={{
            height: 48,
            borderRadius: colors.radius,
            borderWidth: 1.5,
            borderStyle: "solid",
            borderColor: colors.border,
            backgroundColor: colors.input,
            paddingLeft: 14,
            paddingRight: 14,
            fontSize: 15,
            color: colors.foreground,
            fontFamily: "Inter_400Regular, sans-serif",
            width: "100%",
            boxSizing: "border-box" as any,
            outline: "none",
          }}
        />
        {value && (
          <TouchableOpacity onPress={() => onChange(null)} style={styles.clearBtn}>
            <Text style={[styles.clearText, { color: colors.destructive }]}>Clear date</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <Pressable
        onPress={() => setShowPicker(true)}
        style={({ pressed }) => [
          styles.dateTrigger,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            borderRadius: colors.radius,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Feather name="calendar" size={16} color={colors.mutedForeground} />
        <Text
          style={[
            styles.dateText,
            { color: value ? colors.foreground : colors.mutedForeground },
          ]}
        >
          {formatDisplay(value)}
        </Text>
        {value && (
          <TouchableOpacity
            onPress={() => onChange(null)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </Pressable>

      {showPicker && (
        <Modal transparent animationType="slide" visible={showPicker}>
          <Pressable style={styles.overlay} onPress={() => setShowPicker(false)} />
          <View
            style={[
              styles.pickerSheet,
              { backgroundColor: colors.card, borderRadius: colors.radius },
            ]}
          >
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, { color: colors.foreground }]}>
                Select Due Date
              </Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={[styles.doneText, { color: colors.primary }]}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={dateValue}
              mode="date"
              display="spinner"
              onChange={handleChange}
              minimumDate={new Date()}
              themeVariant="light"
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: { gap: 6 },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateTrigger: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1.5,
  },
  dateText: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  clearBtn: { marginTop: 4 },
  clearText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  pickerSheet: {
    paddingBottom: 24,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pickerTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  doneText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
