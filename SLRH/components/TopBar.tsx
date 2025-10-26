import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";

export default function TopBar({
  title = "Chats",
  onMenuPress,
  onSearchPress,
  onProfilePress,
}: {
  title?: string;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const router = useRouter();
  const { palette } = useTheme();

  // Default handlers
  const handleMenu = onMenuPress ?? (() => nav?.openDrawer?.());
  const handleSearch = onSearchPress ?? (() => router.push("/search"));
  const handleProfile = onProfilePress ?? (() => router.push("/profile"));

  return (
    <View
      style={[
        s.container,
        {
          paddingTop: insets.top + 5,
          backgroundColor: palette.background,
        },
      ]}
    >
      {/* === Top Row (Icons) === */}
      <View style={s.iconRow}>
        {/* Left Icon (Menu) */}
        <Pressable
          onPress={handleMenu}
          style={[s.iconBtn, { backgroundColor: palette.card }]}
        >
          <Ionicons name="menu" size={22} color={palette.text} />
        </Pressable>

        {/* Right Icons (Search + Profile) */}
        <View style={s.rightIcons}>
          <Pressable
            onPress={handleSearch}
            style={[s.iconBtn, { backgroundColor: palette.card }]}
          >
            <Ionicons name="search" size={20} color={palette.text} />
          </Pressable>

          <Pressable
            onPress={handleProfile}
            style={[s.iconBtn, { backgroundColor: palette.accent }]}
          >
            <Ionicons name="person" size={22} color={palette.background} />
          </Pressable>
        </View>
      </View>

      {/* === Title Below Icons === */}
      <Text style={[s.title, { color: palette.text }]}>{title}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const s = StyleSheet.create({
  container: {
    height: 110,
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.3,
    fontFamily: "System",
  },
});
