// components/HeaderBack.tsx
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useSegments } from "expo-router";
import { useTheme } from "../context/ThemeContext";

export default function HeaderBack() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { palette } = useTheme();

  return (
    <View
      style={[
        s.header,
        {
          paddingTop: insets.top + 4,
          borderBottomColor: palette.border,
          backgroundColor: palette.background,
        },
      ]}
    >
      <Pressable onPress={() => router.back()} hitSlop={10} style={s.btn}>
        <Ionicons name="chevron-back" size={24} color={palette.text} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
