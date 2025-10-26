import * as React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext"; // 👈 import theme context

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { palette } = useTheme(); // 👈 access the current color palette

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.accent, // use accent color dynamically
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          height: Math.max(64, 56 + insets.bottom),
          paddingBottom: insets.bottom > 0 ? insets.bottom - 2 : 8,
          paddingTop: 8,
          elevation: 10,
          shadowColor: palette.border,
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* 🏠 Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* 🏎️ Racing */}
      <Tabs.Screen
        name="racing/index"
        options={{
          title: "Racing",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" color={color} size={size} />
          ),
        }}
      />

      {/* 📰 Media */}
      <Tabs.Screen
        name="media/index"
        options={{
          title: "Media",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images" color={color} size={size} />
          ),
        }}
      />

      {/* 👥 People */}
      <Tabs.Screen
        name="people/index"
        options={{
          title: "People",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />

      {/* Hidden detail screens */}
      <Tabs.Screen
        name="people/driver/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="people/team/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="racing/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="racing/result/[id]"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}
