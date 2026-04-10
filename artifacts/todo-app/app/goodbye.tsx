import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function GoodbyeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.primary,
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
        },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 40 }]}>
          <Feather name="check-circle" size={56} color="#fff" />
        </View>
        <Text style={styles.title}>Goodbye!</Text>
        <Text style={styles.subtitle}>
          Your tasks are saved. See you next time.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.replace("/")}
          style={({ pressed }) => [
            styles.backBtn,
            {
              backgroundColor: "rgba(255,255,255,0.25)",
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="home" size={18} color="#fff" />
          <Text style={styles.backBtnText}>Return to Main Menu</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  iconWrap: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 24,
  },
  actions: {
    width: "100%",
    paddingBottom: 32,
  },
  backBtn: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  backBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
});
