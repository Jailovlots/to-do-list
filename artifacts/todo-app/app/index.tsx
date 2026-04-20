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
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp, Layout, ZoomIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useTasks } from "@/context/TaskContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

interface MenuItemProps {
  icon: string;
  label: string;
  subtitle: string;
  onPress: () => void;
  accent?: string;
  badge?: number;
  delay?: number;
}

function MenuItem({ icon, label, subtitle, onPress, accent, badge, delay = 0 }: MenuItemProps) {
  const colors = useColors();
  const itemAccent = accent ?? colors.primary;

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.menuItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: 24,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: itemAccent + "15" }]}>
          <Feather name={icon as any} size={24} color={itemAccent} />
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
        <Feather name="chevron-right" size={20} color={colors.mutedForeground} opacity={0.5} />
      </Pressable>
    </Animated.View>
  );
}

export default function MainMenu() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tasks } = useTasks();

  const pending = tasks.filter((t) => t.status === "pending").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const total = tasks.length;
  const progress = total > 0 ? completed / total : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, "#818CF8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          {
            paddingTop: insets.top + 20,
            paddingBottom: 40,
          },
        ]}
      >
        <Animated.View entering={FadeInUp.duration(600)}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Task Master</Text>
              <Text style={styles.headerSub}>Manage your daily flow</Text>
            </View>
            <Pressable style={styles.profileBtn}>
              <Feather name="user" size={20} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>Overall Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <Animated.View 
                layout={Layout.springify()}
                style={[styles.progressBarFill, { width: `${progress * 100}%` }]} 
              />
            </View>
            <Text style={styles.progressSubText}>
              {completed} of {total} tasks completed
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text
          entering={FadeInDown.delay(200)}
          style={[styles.sectionTitle, { color: colors.mutedForeground }]}
        >
          QUICK ACTIONS
        </Animated.Text>
        
        <MenuItem
          icon="plus"
          label="Create Task"
          subtitle="Plan something new today"
          onPress={() => router.push("/add-task")}
          accent={colors.primary}
          delay={300}
        />
        
        <MenuItem
          icon="layers"
          label="All Tasks"
          subtitle="Review and manage list"
          onPress={() => router.push("/tasks")}
          accent="#10b981"
          badge={pending}
          delay={400}
        />

        <View style={styles.gridRow}>
          <Animated.View entering={ZoomIn.delay(500)} style={styles.gridCol}>
            <Pressable 
              onPress={() => router.push("/tasks?mode=edit")}
              style={[styles.smallCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.smallIconWrap, { backgroundColor: "#F59E0B15" }]}>
                <Feather name="edit-3" size={20} color="#F59E0B" />
              </View>
              <Text style={[styles.smallCardLabel, { color: colors.foreground }]}>Edit</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={ZoomIn.delay(600)} style={styles.gridCol}>
            <Pressable 
              onPress={() => router.push("/tasks?mode=delete")}
              style={[styles.smallCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.smallIconWrap, { backgroundColor: "#EF444415" }]}>
                <Feather name="trash-2" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.smallCardLabel, { color: colors.foreground }]}>Delete</Text>
            </Pressable>
          </Animated.View>
        </View>

        <Animated.Text
          entering={FadeInDown.delay(700)}
          style={[styles.sectionTitle, { color: colors.mutedForeground, marginTop: 24 }]}
        >
          SYSTEM
        </Animated.Text>
        
        <MenuItem
          icon="settings"
          label="Preferences"
          subtitle="App theme and settings"
          onPress={() => {}} // Future feature
          accent="#64748B"
          delay={800}
        />

        <MenuItem
          icon="log-out"
          label="Exit"
          subtitle="Goodbye for now"
          onPress={() => router.push("/goodbye")}
          accent="#6366F1"
          delay={900}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  progressPercent: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  progressSubText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  scroll: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuText: { flex: 1 },
  menuLabel: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  menuSub: {
    fontSize: 14,
    marginTop: 2,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginRight: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  gridCol: {
    flex: 1,
  },
  smallCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  smallIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  smallCardLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
});

