// app/(tabs)/_layout.tsx
import * as React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00E0C6",
        tabBarInactiveTintColor: "#9AA0A6",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginBottom: 2 },

        // ✅ SOLID bar (not transparent)
        tabBarStyle: {
          backgroundColor: "#0b0b0b",        // solid background
          borderTopColor: "#1a1a1a",         // thin divider
          borderTopWidth: 1,
          height: Math.max(64, 56 + insets.bottom), // give it height & safe-area padding
          paddingBottom: insets.bottom > 0 ? insets.bottom - 2 : 8,
          paddingTop: 8,

          // nice shadow on Android/iOS
          elevation: 10,                      // Android shadow
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
        },

        // helpful when typing
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="live/index"
        options={{
          title: "Live",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="radio" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="media/index"
        options={{
          title: "Media",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="blog/index"
        options={{
          title: "Blog",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
