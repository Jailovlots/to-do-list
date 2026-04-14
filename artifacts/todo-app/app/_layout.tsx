import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, StyleSheet, Platform } from "react-native";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TaskProvider } from "@/context/TaskContext";
import { setBaseUrl } from "@workspace/api-client-react";

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (Platform.OS === "web") return "http://localhost:5000";
  // Fallback for mobile if env is missing (not ideal, but safer)
  return "http://10.189.33.139:5000";
};

setBaseUrl(getBaseUrl());

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-task" />
      <Stack.Screen name="tasks" />
      <Stack.Screen name="task/[id]" />
      <Stack.Screen name="goodbye" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Proceed even if fonts fail to load, falling back to system fonts.
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <TaskProvider>
                <View style={styles.appWrapper}>
                  <View style={styles.contentContainer}>
                    <RootLayoutNav />
                  </View>
                </View>
              </TaskProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#f4f4f5" : "transparent",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 500 : "100%",
    backgroundColor: "#fff",
    // Adding a subtle shadow for web to distinguish the "phone" container
    ...(Platform.OS === "web" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    }),
  },
});
