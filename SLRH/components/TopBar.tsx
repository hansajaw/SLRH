import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title?: string;
  showMenu?: boolean;
  showSearch?: boolean;
  showProfile?: boolean;
  showBack?: boolean;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
  onBackPress?: () => void;
  style?: any;
};

export default function TopBar({
  title = "SLRH",
  showMenu = true,
  showSearch = true,
  showProfile = true,
  showBack = false,
  onMenuPress,
  onSearchPress,
  onProfilePress,
  onBackPress,
  style,
}: Props) {
  const router = useRouter();
  const nav = useNavigation<any>(); // for Drawer
  const insets = useSafeAreaInsets();

  // ✅ Fallbacks for button actions
  const goProfile = onProfilePress ?? (() => router.push("/profile"));
  const goSearch = onSearchPress ?? (() => router.push("/search"));
  const openMenu = onMenuPress ?? (() => nav?.openDrawer?.());

  // ✅ Back navigation fix — goes to previous page, not home
  const goBack =
    onBackPress ??
    (() => {
      if (router.canGoBack()) {
        router.back(); // go to previous page
      } else {
        router.replace("/"); // fallback to home ONLY if no history
      }
    });

  return (
    <View
      style={[
        styles.wrap,
        { paddingTop: Math.max(8, insets.top * 0.25) },
        style,
      ]}
    >
      {/* ===== LEFT SIDE ===== */}
      <View style={styles.left}>
        {showBack ? (
          <IconBtn icon="chevron-back" onPress={goBack} label="Go back" />
        ) : showMenu ? (
          <IconBtn icon="menu" onPress={openMenu} label="Open menu" />
        ) : (
          <View style={styles.btn} />
        )}
      </View>

      {/* ===== TITLE ===== */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* ===== RIGHT SIDE ===== */}
      <View style={styles.right}>
        {showSearch && (
          <IconBtn icon="search" size={22} onPress={goSearch} label="Search" />
        )}
        {showProfile && (
          <IconBtn
            icon="person-circle"
            onPress={goProfile}
            label="My profile"
          />
        )}
        {!showSearch && !showProfile ? <View style={styles.btn} /> : null}
      </View>
    </View>
  );
}

/* ---------- Small reusable icon button ---------- */
function IconBtn({
  icon,
  onPress,
  label,
  size = 24,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  label: string;
  size?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.btn}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={size} color="#fff" />
    </Pressable>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#0b0b0b",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomColor: "#111",
    borderBottomWidth: 1,
  },
  left: {
    width: 48,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  right: {
    width: 96,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  btn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
  },
});
