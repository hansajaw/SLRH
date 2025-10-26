import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router } from "expo-router";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

export default function SideMenu({ navigation }: DrawerContentComponentProps) {
  const { user, logout } = useUser();
  const { palette } = useTheme();

  const name = user?.fullName?.split(" ")[0] ?? "User";
  const caption =
    user?.caption || "Fueling your passion for speed. \nBuckle up!";
  const avatarUri = user?.avatarUri;
  const initial = name.charAt(0).toUpperCase();

  const go = (path: any) => {
    navigation.closeDrawer();
    router.push(path);
  };

  const confirmSignOut = () => {
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              navigation.closeDrawer();
              router.replace("/auth/login" as any);
            } catch (err) {
              console.error("❌ Sign-out failed:", err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView
      style={[s.safe, { backgroundColor: palette.background }]}
      edges={["top", "bottom"]}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={[palette.card, palette.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[s.header, { borderBottomColor: palette.border }]}
      >
        <View style={s.headerRow}>
          <View style={s.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={s.avatar} />
            ) : (
              <View
                style={[
                  s.avatar,
                  { backgroundColor: palette.border, alignItems: "center", justifyContent: "center" },
                ]}
              >
                <Text style={[s.initial, { color: palette.accent }]}>
                  {initial}
                </Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[s.hi, { color: palette.text }]}>
              Hi, <Text style={{ color: palette.accent }}>{name}</Text>
            </Text>
            <Text
              style={[s.caption, { color: palette.textSecondary }]}
              numberOfLines={3}
            >
              {caption}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Menu Body */}
      <ScrollView
        contentContainerStyle={s.scrollCC}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.menuCol}>
          <Group title="Store" icon="bag-handle-outline" palette={palette} />
          <Item label="Visit Store" onPress={() => go("/store")} palette={palette} />
          <Separator palette={palette} />

          <Group title="Sponsors" icon="ribbon-outline" palette={palette} />
          <Item label="Our Sponsors" onPress={() => go("/sponsors")} palette={palette} />
          <Separator palette={palette} />

          <Group title="Fan Zone" icon="sparkles-outline" palette={palette} />
          <SubItem
            icon="star-outline"
            label="Ratings"
            onPress={() => go("/fanzone/ratings")}
            palette={palette}
          />
          <SubItem
            icon="help-buoy-outline"
            label="Polls & Quizzes"
            onPress={() => go("/fanzone/polls")}
            palette={palette}
          />
          <Separator palette={palette} />

          <Group title="About Us" icon="information-circle-outline" palette={palette} />
          <Item label="Who We Are" onPress={() => go("/about")} palette={palette} />

          <View style={{ flexGrow: 1 }} />
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Pressable
            style={[s.signOut, { backgroundColor: palette.accent }]}
            onPress={confirmSignOut}
          >
            <Ionicons name="log-out-outline" size={18} color={palette.background} />
            <Text
              style={{
                color: palette.background,
                fontWeight: "900",
              }}
            >
              Sign Out
            </Text>
          </Pressable>

          <Text
            style={[
              s.footerNote,
              { color: palette.textSecondary, textAlign: "center" },
            ]}
          >
            SLRH • Built for fans of speed
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Reusable Elements ---------------- */

function Group({
  title,
  icon,
  palette,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  palette: any;
}) {
  return (
    <View style={s.headingRow}>
      <View
        style={[
          s.headingIcon,
          { backgroundColor: palette.accent + "22" },
        ]}
      >
        <Ionicons name={icon} size={16} color={palette.accent} />
      </View>
      <Text style={[s.headingText, { color: palette.text }]}>{title}</Text>
    </View>
  );
}

function Item({
  label,
  onPress,
  palette,
}: {
  label: string;
  onPress: () => void;
  palette: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        s.item,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <Text style={[s.itemText, { color: palette.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={palette.textSecondary} />
    </Pressable>
  );
}

function SubItem({
  icon,
  label,
  onPress,
  palette,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  palette: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        s.subItem,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <View style={s.subIcon}>
        <Ionicons name={icon} size={16} color={palette.accent} />
      </View>
      <Text style={[s.subText, { color: palette.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={palette.textSecondary} />
    </Pressable>
  );
}

function Separator({ palette }: { palette: any }) {
  return (
    <View
      style={[s.separator, { backgroundColor: palette.border + "33" }]}
    />
  );
}

/* ---------------- Styles ---------------- */
const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 22,
    borderBottomWidth: 1,
  },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, overflow: "hidden" },
  avatar: { width: "100%", height: "100%" },
  initial: { fontWeight: "900", fontSize: 18 },
  hi: { fontWeight: "900", fontSize: 18 },
  caption: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
  },
  scrollCC: { paddingBottom: 16, minHeight: "100%" },
  menuCol: { paddingHorizontal: 14, paddingTop: 12, gap: 10 },
  headingRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 8 },
  headingIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: { fontWeight: "900", fontSize: 14 },
  item: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemText: { fontWeight: "800", flex: 1 },
  subItem: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subIcon: { width: 28, alignItems: "center" },
  subText: { fontWeight: "800", flex: 1 },
  separator: { height: 1, marginVertical: 4 },
  footer: { paddingHorizontal: 14, paddingTop: 8 },
  signOut: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  footerNote: { marginTop: 8, fontWeight: "700", fontSize: 12 },
});
