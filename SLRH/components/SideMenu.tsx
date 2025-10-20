// components/SideMenu.tsx
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

export default function SideMenu({ navigation }: DrawerContentComponentProps) {
  const { user, logout } = useUser();

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
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      {/* Header */}
      <LinearGradient
        colors={["#103231", "#0b0b0b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.header}
      >
        <View style={s.headerRow}>
          <View style={s.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={s.avatar} />
            ) : (
              <View style={[s.avatar, s.avatarFallback]}>
                <Text style={s.initial}>{initial}</Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.hi}>
              Hi, <Text style={{ color: "#C6FFF4" }}>{name}</Text>
            </Text>
            <Text style={s.caption} numberOfLines={4}>
              {caption}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        contentContainerStyle={s.scrollCC}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.menuCol}>
          <Group title="Store" icon="bag-handle-outline" />
          <Item label="Visit Store" onPress={() => go("/store")} />
          <Separator />

          <Group title="Sponsors" icon="ribbon-outline" />
          <Item label="Our Sponsors" onPress={() => go("/sponsors")} />
          <Separator />

          <Group title="Fan Zone" icon="sparkles-outline" />
          <SubItem
            icon="star-outline"
            label="Ratings"
            onPress={() => go("/fanzone/ratings")}
          />
          <SubItem
            icon="help-buoy-outline"
            label="Polls & Quizzes"
            onPress={() => go("/fanzone/polls")}
          />
          <Separator />

          <Group title="About Us" icon="information-circle-outline" />
          <Item label="Who We Are" onPress={() => go("/about")} />
          <View style={{ flexGrow: 1 }} />
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Pressable style={s.signOut} onPress={confirmSignOut}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "900" }}>Sign Out</Text>
          </Pressable>

          <Text style={s.footerNote} numberOfLines={1}>
            SLRH • Built for fans of speed
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Small components ---------- */
function Group({
  title,
  icon,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={s.headingRow}>
      <View style={s.headingIcon}>
        <Ionicons name={icon} size={16} color="#9adbd2" />
      </View>
      <Text style={s.headingText}>{title}</Text>
    </View>
  );
}

function Item({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={s.item}>
      <Text style={s.itemText}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#8b9197" />
    </Pressable>
  );
}

function SubItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={s.subItem}>
      <View style={s.subIcon}>
        <Ionicons name={icon} size={16} color="#9adbd2" />
      </View>
      <Text style={s.subText}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#8b9197" />
    </Pressable>
  );
}

function Separator() {
  return <View style={s.separator} />;
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#101417",
  },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, overflow: "hidden" },
  avatar: { width: "100%", height: "100%" },
  avatarFallback: {
    backgroundColor: "#1b1e24",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { color: "#95e7db", fontWeight: "900", fontSize: 18 },
  hi: { color: "#EFFFFB", fontWeight: "900", fontSize: 18 },
  caption: {
    color: "#94c8c1",
    marginTop: 8,
    fontWeight: "700",
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
    backgroundColor: "rgba(124, 240, 225, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: { color: "#e5edf0", fontWeight: "900", fontSize: 14 },
  item: {
    backgroundColor: "#0f1620",
    borderColor: "#192334",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemText: { color: "#fff", fontWeight: "800", flex: 1 },
  subItem: {
    backgroundColor: "#0d121a",
    borderColor: "#182133",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subIcon: { width: 28, alignItems: "center" },
  subText: { color: "#dfe6ea", fontWeight: "800", flex: 1 },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 4,
  },
  footer: { paddingHorizontal: 14, paddingTop: 8 },
  signOut: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  footerNote: {
    color: "#7c8791",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "700",
    fontSize: 12,
  },
});
